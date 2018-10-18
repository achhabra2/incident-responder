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
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: `Successfully added email(s) to your notification list: ${parameters.email.toString()}`,
        });
        response.end();
      } else {
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: `Sorry there are existing users found: ${duplicates.toString()}. `,
        });
        response.end();
      }
    },
    'user.delete': async () => {
      if (!parameters.email || parameters.email.length === 0) {
        const event = { name: 'webhook-list' };
        const user = await db.getUser(originalMessage.personEmail);
        event.data = { emails: user.iotGroup };
        const personStr = getPersonStr(user);
        followupResponse(response, event);
        await Spark.messages.create({
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
          Spark.messages.create({
            roomId: originalMessage.roomId,
            markdown: `Successfully removed emails ${deleteArray.toString()}.`,
          });
          response.end();
        } else {
          Spark.messages.create({
            roomId: originalMessage.roomId,
            markdown: 'No email addresses found that could be removed. ',
          });
          response.end();
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
            Spark.messages.create({
              roomId: originalMessage.roomId,
              markdown: `Invalid entry ${number}. Could not remove. `,
            });
            response.end();
            return;
          }
        }
        /* eslint-enable */
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: `Deleted user(s) ${deletedUsers.toString()} successfully.`,
        });
        response.end();
      } else {
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: 'Invalid request. Error Deleting User. ',
        });
        response.end();
      }
    },
    'user.list': async () => {
      const user = await db.getUser(originalMessage.personEmail);
      const personStr = getPersonStr(user);
      if (personStr) {
        response.end();
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: `Here is your notification list: \r\n${personStr}`,
        });
      } else {
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: 'Sorry you have no one in your list. ',
        });
        response.end();
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
        mdMessage += `JSON Data:\r\n\`\`\`javascript\r\n${payload}\r\n${comments}\r\n\`\`\`\r\n`;
        mdMessage += `You can also use the following curl command: \r\n\`\`${curl}\`\``;
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: mdMessage,
        });
        response.end();
      } else {
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: 'Looks like you have not added any users yet. Please finish configuration first.',
        });
        response.end();
      }
    },
    'user.messages.add': async () => {
      if (parameters.message) {
        try {
          await db.addMessage(originalMessage.personEmail, parameters.message);
          Spark.messages.create({
            roomId: originalMessage.roomId,
            markdown: 'Successfully Updated IOT Event Message',
          });
          response.end();
        } catch (error) {
          Spark.messages.create({
            roomId: originalMessage.roomId,
            markdown: 'Error updating your message. ',
          });
          response.end();
        }
      } else {
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: 'No message specified. ',
        });
        response.end();
      }
    },
    'user.messages.get': async () => {
      try {
        const user = await db.getUser(originalMessage.personEmail);
        if (user.iotMessage) {
          Spark.messages.create({
            roomId: originalMessage.roomId,
            markdown: `Your Event message is: ${user.iotMessage}`,
          });
          response.end();
        } else {
          Spark.messages.create({
            roomId: originalMessage.roomId,
            markdown: 'Sorry you have not set an event message yet. ',
          });
          response.end();
        }
      } catch (e) {
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: 'Error Getting Message',
        });
        response.end();
      }
    },
    'event.fire': async () => {
      try {
        const user = await db.getUser(originalMessage.personEmail);
        if (user.iotMessage && user.iotGroup) {
          Spark.messages.create({
            roomId: originalMessage.roomId,
            markdown: 'Starting IOT Event',
          });
          response.end();
          await fireEvent({ email: originalMessage.personEmail, title: parameters.title });
        } else {
          Spark.messages.create({
            roomId: originalMessage.roomId,
            markdown: 'Sorry you have not set your notification group and message. ',
          });
          response.end();
        }
      } catch (e) {
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: 'Sorry there was an error pulling up your saved information. ',
        });
        response.end();
      }
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
