'use strict';Object.defineProperty(exports, "__esModule", { value: true }); // Function to send correctly formatted responses to Dialogflow which are then sent to the user
var sendResponse = function sendResponse(response, responseToUser) {
  // if the response is a string send it as a response to the user
  if (typeof responseToUser === 'string') {
    var responseJson = {};
    responseJson.speech = responseToUser; // spoken response
    responseJson.displayText = responseToUser; // displayed response
    response.json(responseJson); // Send response to Dialogflow
  } else {
    // If the response to the user includes rich responses or contexts send them to Dialogflow
    var _responseJson = {};

    // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
    _responseJson.speech = responseToUser.speech || responseToUser.displayText;
    _responseJson.displayText = responseToUser.displayText || responseToUser.speech;

    // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
    _responseJson.data = responseToUser.richResponses;

    // Optional: add contexts (https://dialogflow.com/docs/contexts)
    _responseJson.contextOut = responseToUser.outputContexts;

    response.json(_responseJson); // Send response to Dialogflow
  }
};

var sendDataResponse = function sendDataResponse(httpRes, message) {
  var responseJson = {
    speech: message.text,
    displayText: message.text,
    data: {
      spark: {
        roomId: message.roomId,
        markdown: message.markdown } } };



  console.log('Sending Response: ');
  console.log(responseJson);
  httpRes.json(responseJson);
};


var followupResponse = function followupResponse(httpRes, event) {
  var responseJson = {
    speech: 'Who would you like to remove?:',
    displayText: 'Who would you like to remove?:',
    source: 'Webhook',
    contextOut: [{ name: event.name, parameters: { groupEmails: event.data.emails } }] };

  console.log('Sending Follow Up Response: ');
  console.log(responseJson);
  httpRes.json(responseJson);
};

var getPersonStr = function getPersonStr(user) {
  var personStr = '';
  if (user.iotGroup && Array.isArray(user.iotGroup)) {
    user.iotGroup.forEach(function (person, index) {
      personStr += index + 1 + '. ' + person + ' \r\n';
    });
  }
  return personStr;
};exports.


sendDataResponse = sendDataResponse;exports.
sendResponse = sendResponse;exports.
followupResponse = followupResponse;exports.
getPersonStr = getPersonStr;