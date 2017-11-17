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
      let emailString = '';
      /* eslint-disable */
      // console.log(`Adding Email to list for ${originalMessage.personEmail}: ${parameters.email}.`);
      for (const email of parameters.email) {
        let user = await db.addEmail(originalMessage.personEmail, email);
        emailString += `**${email}**, `;
      }
      /* eslint-enable */
      Spark.messages.create({
        roomId: originalMessage.roomId,
        markdown: `Successfully added email(s) to your notification list: ${emailString}`,
      });
      response.end();
    },
    'user.delete': async () => {
      if (!parameters.email) {
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
        await db.removeEmail(originalMessage.personEmail, parameters.email);
        Spark.messages.create({
          roomId: originalMessage.roomId,
          markdown: `Successfully removed email(s): **${parameters.email}**`,
        });
        response.end();
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
        const payload = JSON.stringify({
          id: user._id,
          // email: originalMessage.personEmail,
          title: 'Your Event Title',
          data: 'Optional Data Message to be sent. ',
          call: false,
        }, null, 2);
        const comments = '// data and call are optional. \r\n// call is a true|false argument.';
        let mdMessage = 'Use the following [link](https://us-central1-incident-response-626e6.cloudfunctions.net/iotEvent) and send a HTTP POST request with  ';
        mdMessage += `JSON Body:\r\n\`\`\` javascript\r\n${payload}\r\n${comments}\r\n\`\`\``;
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
