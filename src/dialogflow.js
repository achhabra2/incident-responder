

import { sendDataResponse, sendResponse, followupResponse, getPersonStr } from './formatters';
import { fireEvent } from './iotEvent';

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
const SPARK_TOKEN = require('../config').SPARK_TOKEN;
const db = require('./userDb');

const Spark = require('ciscospark').init({
  credentials: {
    authorization: {
      access_token: SPARK_TOKEN,
    },
  },
});

exports.dialogflowFulfillment = functions.https.onRequest((request, response) => {
  console.log(`Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Request body: ${JSON.stringify(request.body)}`);

  // // An action is a string used to identify what needs to be done in fulfillment
  // const action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
  // const inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
  // const parameters = request.body.result.parameters; //

  let { action, parameters, inputContexts } = request.body.result;

  const originalMessage = request.body.originalRequest.data.data;
  // Get the request source (Google Assistant, Slack, API, etc) and initialize DialogflowApp
  const requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;
  const app = new DialogflowApp({ request, response });

  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    'user.add': async () => {
      let emailString = '';
      for (const email of parameters.email) {
        emailString += `**${email}** `;
        await db.addEmail(originalMessage.personEmail, email);
      }
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
        for (const number of parameters.number) {
          if (number - 1 < user.iotGroup.length) {
            deletedUsers.push(user.iotGroup[number - 1]);
            await user.update({ $pull: { iotGroup: user.iotGroup[number - 1] } }).exec();
          } else {
            sendResponse(response, `Invalid entry ${number}. Could not remove. `);
            return;
          }
        }
        sendResponse(response, `Deleted user(s) ${deletedUsers.toString()} successfully.`);
      } else sendResponse(response, 'Invalid request. Error Deleting User. ');
    },
    'user.list': async () => {
      const user = await db.getUser(originalMessage.personEmail);
      const personStr = getPersonStr(user);
      sendResponse(response, 'Here is your notification list: ');
      Spark.messages.create({
        roomId: originalMessage.roomId,
        markdown: `${personStr}`,
      });
    },
    'endpoint.get': async () => {
      let mdMessage = 'Use the following [link](https://us-central1-incident-response-626e6.cloudfunctions.net/iotEvent) and send a HTTP POST request with  ';
      mdMessage += 'JSON Body:\r\n\`\`\` javascript\r\n{\r\n  "email": "{{YOUR-EMAIL}}", \r\n  "title": "{{EVENT-NAME}}",\r\n  "data": "{{PAYLOAD-DATA}}",\r\n  "call": {{true|false}}\r\n}\r\n\`\`\`';
      Spark.messages.create({
        roomId: originalMessage.roomId,
        markdown: mdMessage,
      });
      response.end();
    },
    'user.messages.add': async () => {
      if (parameters.message) {
        await db.addMessage(originalMessage.personEmail, parameters.message);
        sendResponse(response, 'Successfully Updated IOT Event Message');
      } else sendResponse(response, 'Error Updating Message');
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
        // richResponses: richResponses, // Optional, uncomment to enable
        // outputContexts: [{'name': 'weather', 'lifespan': 2, 'parameters': {'city': 'Rome'}}], // Optional, uncomment to enable
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
});
