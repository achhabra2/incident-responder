/* eslint-disable */
'use strict';
if (process.env.NODE_ENV != 'PRODUCTION') {
  require('dotenv/config');
}
var dialogflowFulfillment = require('./dist/dialogflow').dialogflowFulfillment;
var iotEvent = require('./dist/iotEvent').iotEvent;

module.exports = {
  dialogflowFulfillment: dialogflowFulfillment,
  iotEvent: iotEvent
};