'use strict';

var dialogflowFulfillment = require('./dist/dialogflow').dialogflowFulfillment;
var iotEvent = require('./dist/iotEvent').iotEvent;

module.exports = {
  dialogflowFulfillment: dialogflowFulfillment,
  iotEvent: iotEvent };