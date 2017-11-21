import * as functions from 'firebase-functions';
import { sendResponse, followupResponse, getPersonStr } from './formatters';
import { fireEvent } from './utils';
import { SPARK_TOKEN } from '../config';
import db from './userDb';


const Spark = require('ciscospark').init({
  credentials: {
    authorization: {
      access_token: SPARK_TOKEN,
    },
  },
});

function fulfillment(request, response) {
  console.log(`Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Request body: ${JSON.stringify(request.body)}`);

  let { action, parameters, inputContexts } = request.body.result; // eslint-disable-line

  const originalMessage = request.body.originalRequest.data.data;

  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    'user.add': async () => {
      /* eslint-disable */
      const duplicates = await db.findDuplicates(originalMessage.personEmail, parameters.email);
      if (duplicates.length === 0) {
        for (const email of parameters.email) {
          await db.addEmail(originalMessage.personEmail, email);
        }
        /* eslint-enable */
        sendResponse(response, `Successfully added email(s) to your notification list: ${parameters.email.toString()}`);
      } else {
        sendResponse(response, `Sorry there are existing users found: ${duplicates.toString()}. `);
      }
    },
    'user.delete': async () => {
      if (!parameters.email || parameters.email.length === 0) {
        const event = { name: 'webhook-list' };
        const user = await db.getUser(originalMessage.personEmail);
        event.data = { emails: user.iotGroup };
        const personStr = getPersonStr(user);
        followupResponse(response, event);
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: `${personStr}`,
        });
      } else {
        let deleteArray;
        try {
          deleteArray = await db.findDuplicates(originalMessage.personEmail, parameters.email);
        } catch (error) {
          deleteArray = [];
        }
        if (deleteArray.length > 0) {
          /* eslint-disable */
          for (const email of deleteArray) {
            await db.removeEmail(originalMessage.personEmail, email);
          }
          /* eslint-enable */
          sendResponse(response, `Successfully removed emails ${deleteArray.toString()}.`);
        } else {
          sendResponse(response, 'No email addresses found that could be removed. ');
        }
      }
    },
    'user.delete.number': async () => {
      console.log('Delete by number webhook triggered. ');
      const user = await db.getUser(originalMessage.personEmail);
      if (user.iotGroup && parameters.number) {
        const deletedUsers = [];
        /* eslint-disable */
        for (const number of parameters.number) {
          if (number - 1 < user.iotGroup.length) {
            deletedUsers.push(user.iotGroup[number - 1]);
            await user.update({ $pull: { iotGroup: user.iotGroup[number - 1] } }).exec();
          } else {
            sendResponse(response, `Invalid entry ${number}. Could not remove. `);
            return;
          }
        }
        /* eslint-enable */
        sendResponse(response, `Deleted user(s) ${deletedUsers.toString()} successfully.`);
      } else sendResponse(response, 'Invalid request. Error Deleting User. ');
    },
    'user.list': async () => {
      const user = await db.getUser(originalMessage.personEmail);
      const personStr = getPersonStr(user);
      if (personStr) {
        sendResponse(response, 'Here is your notification list: ');
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: `${personStr}`,
        });
      } else {
        sendResponse(response, 'Sorry you have no one in your list. ');
      }
    },
    'endpoint.get': async () => {
      const user = await db.getUser(originalMessage.personEmail);
      if (user) {
        const sampleJson = {
          id: user._id,
          title: 'Your Event Title',
          data: 'Optional Data Message to be sent. ',
          call: false,
        };
        const payload = JSON.stringify(sampleJson, null, 2);
        const link = 'https://us-central1-incident-response-626e6.cloudfunctions.net/iotEvent';
        const comments = '// data (optional) - Sensor data you\'d like to include in the message.\r\n// call is a true|false argument. True if you want to immediately start Spark Meeting.';
        const curl = `curl -d '${JSON.stringify(sampleJson)}' -H "Content-Type: application/json" -X POST ${link}`;
        let mdMessage = 'Use the following [URL](https://us-central1-incident-response-626e6.cloudfunctions.net/iotEvent) and send an HTTP POST request with  ';
        mdMessage += `JSON Data:\r\n\`\`\`javascript\r\n${payload}\r\n${comments}\r\n\`\`\``;
        mdMessage += `\r\nYou can also use the following curl command: \r\n\`\`${curl}\`\``;
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: mdMessage,
        });
        response.end();
      } else {
        sendResponse('Looks like you have not added any users yet. Please finish configuration first.');
      }
    },
    'user.messages.add': async () => {
      if (parameters.message) {
        try {
          await db.addMessage(originalMessage.personEmail, parameters.message);
          sendResponse(response, 'Successfully Updated IOT Event Message');
        } catch (error) {
          sendResponse(response, 'Error updating your message. ');
        }
      } else sendResponse(response, 'No message specified. ');
    },
    'user.messages.get': async () => {
      try {
        const user = await db.getUser(originalMessage.personEmail);
        sendResponse(response, `Your Event message is: ${user.iotMessage}`);
      } catch (e) { sendResponse(response, 'Error Getting Message'); }
    },
    'event.fire': () => {
      fireEvent({ email: originalMessage.personEmail, title: parameters.title });
      sendResponse(response, 'Starting IOT Event');
    },
    // Default handler for unknown or undefined actions
    default: () => {
      const responseToUser = {
        speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor!', // spoken response
        displayText: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)', // displayed response
      };
      sendResponse(response, responseToUser);
    },
  };

  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }

  // Run the proper handler function to handle the request from Dialogflow
  actionHandlers[action]();
}

exports.dialogflowFulfillment = functions.https.onRequest(fulfillment);
