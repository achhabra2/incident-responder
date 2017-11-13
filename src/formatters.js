// Function to send correctly formatted responses to Dialogflow which are then sent to the user
const sendResponse = (response, responseToUser) => {
  // if the response is a string send it as a response to the user
  if (typeof responseToUser === 'string') {
    const responseJson = {};
    responseJson.speech = responseToUser; // spoken response
    responseJson.displayText = responseToUser; // displayed response
    response.json(responseJson); // Send response to Dialogflow
  } else {
    // If the response to the user includes rich responses or contexts send them to Dialogflow
    const responseJson = {};

    // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
    responseJson.speech = responseToUser.speech || responseToUser.displayText;
    responseJson.displayText = responseToUser.displayText || responseToUser.speech;

    // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
    responseJson.data = responseToUser.richResponses;

    // Optional: add contexts (https://dialogflow.com/docs/contexts)
    responseJson.contextOut = responseToUser.outputContexts;

    response.json(responseJson); // Send response to Dialogflow
  }
};

const sendDataResponse = (httpRes, message) => {
  const responseJson = {
    speech: message.text,
    displayText: message.text,
    data: {
      spark: {
        roomId: message.roomId,
        markdown: message.markdown,
      },
    },
  };
  console.log('Sending Response: ');
  console.log(responseJson);
  httpRes.json(responseJson);
};


const followupResponse = (httpRes, event) => {
  const responseJson = {
    speech: 'Who would you like to remove?:',
    displayText: 'Who would you like to remove?:',
    source: 'Webhook',
    contextOut: [{ name: event.name, parameters: { groupEmails: event.data.emails } }],
  };
  console.log('Sending Follow Up Response: ');
  console.log(responseJson);
  httpRes.json(responseJson);
};

const getPersonStr = (user) => {
  let personStr = '';
  if (user.iotGroup && Array.isArray(user.iotGroup)) {
    user.iotGroup.forEach((person, index) => {
      personStr += `${index + 1}. ${person} \r\n`;
    });
  }
  return personStr;
};

export {
  sendDataResponse,
  sendResponse,
  followupResponse,
  getPersonStr,
};
