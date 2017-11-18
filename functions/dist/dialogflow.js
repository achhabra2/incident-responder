'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _firebaseFunctions = require('firebase-functions');var functions = _interopRequireWildcard(_firebaseFunctions);
var _formatters = require('./formatters');
var _utils = require('./utils');
var _config = require('../config');
var _userDb = require('./userDb');var _userDb2 = _interopRequireDefault(_userDb);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}


var Spark = require('ciscospark').init({
  credentials: {
    authorization: {
      access_token: _config.SPARK_TOKEN } } });




function fulfillment(request, response) {var _this = this;
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));var _request$body$result =

  request.body.result,action = _request$body$result.action,parameters = _request$body$result.parameters,inputContexts = _request$body$result.inputContexts; // eslint-disable-line

  var originalMessage = request.body.originalRequest.data.data;

  // Create handlers for Dialogflow actions as well as a 'default' handler
  var actionHandlers = {
    'user.add': function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {var user, duplicates, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, email, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _email;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (

                  _userDb2.default.getUser(originalMessage.personEmail));case 2:user = _context.sent;
                duplicates = [];if (!(
                user && user.iotGroup)) {_context.next = 24;break;}_iteratorNormalCompletion = true;_didIteratorError = false;_iteratorError = undefined;_context.prev = 8;
                for (_iterator = parameters.email[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {email = _step.value;
                  if (user.iotGroup.indexOf(email)) {
                    duplicates.push(email);
                  }
                }_context.next = 16;break;case 12:_context.prev = 12;_context.t0 = _context['catch'](8);_didIteratorError = true;_iteratorError = _context.t0;case 16:_context.prev = 16;_context.prev = 17;if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}case 19:_context.prev = 19;if (!_didIteratorError) {_context.next = 22;break;}throw _iteratorError;case 22:return _context.finish(19);case 23:return _context.finish(16);case 24:if (!(

                duplicates.length === 0)) {_context.next = 54;break;}_iteratorNormalCompletion2 = true;_didIteratorError2 = false;_iteratorError2 = undefined;_context.prev = 28;_iterator2 =
                parameters.email[Symbol.iterator]();case 30:if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {_context.next = 37;break;}_email = _step2.value;_context.next = 34;return (
                  _userDb2.default.addEmail(originalMessage.personEmail, _email));case 34:_iteratorNormalCompletion2 = true;_context.next = 30;break;case 37:_context.next = 43;break;case 39:_context.prev = 39;_context.t1 = _context['catch'](28);_didIteratorError2 = true;_iteratorError2 = _context.t1;case 43:_context.prev = 43;_context.prev = 44;if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}case 46:_context.prev = 46;if (!_didIteratorError2) {_context.next = 49;break;}throw _iteratorError2;case 49:return _context.finish(46);case 50:return _context.finish(43);case 51:

                /* eslint-enable */
                (0, _formatters.sendResponse)(response, 'Successfully added email(s) to your notification list: ' + parameters.email.toString());_context.next = 55;break;case 54:

                (0, _formatters.sendResponse)(response, 'Sorry there are existing users found: ' + duplicates.toString + '. ');case 55:case 'end':return _context.stop();}}}, _callee, _this, [[8, 12, 16, 24], [17,, 19, 23], [28, 39, 43, 51], [44,, 46, 50]]);}));return function userAdd() {return _ref.apply(this, arguments);};}(),


    'user.delete': function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {var event, user, personStr, _user, deleteArray, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _email2, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, email;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (!(
                !parameters.email || parameters.email.length === 0)) {_context2.next = 11;break;}
                event = { name: 'webhook-list' };_context2.next = 4;return (
                  _userDb2.default.getUser(originalMessage.personEmail));case 4:user = _context2.sent;
                event.data = { emails: user.iotGroup };
                personStr = (0, _formatters.getPersonStr)(user);
                (0, _formatters.followupResponse)(response, event);
                Spark.messages.create({
                  roomId: originalMessage.roomId,
                  markdown: '' + personStr });_context2.next = 65;break;case 11:_context2.next = 13;return (


                  _userDb2.default.getUser(originalMessage.personEmail));case 13:_user = _context2.sent;
                deleteArray = [];
                /* eslint-disable */_iteratorNormalCompletion3 = true;_didIteratorError3 = false;_iteratorError3 = undefined;_context2.prev = 18;
                for (_iterator3 = parameters.email[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {_email2 = _step3.value;
                  if (_user.iotGroup.indexOf(_email2)) {
                    deleteArray.push(_email2);
                  }
                }_context2.next = 26;break;case 22:_context2.prev = 22;_context2.t0 = _context2['catch'](18);_didIteratorError3 = true;_iteratorError3 = _context2.t0;case 26:_context2.prev = 26;_context2.prev = 27;if (!_iteratorNormalCompletion3 && _iterator3.return) {_iterator3.return();}case 29:_context2.prev = 29;if (!_didIteratorError3) {_context2.next = 32;break;}throw _iteratorError3;case 32:return _context2.finish(29);case 33:return _context2.finish(26);case 34:if (!(
                deleteArray.length > 0)) {_context2.next = 64;break;}_iteratorNormalCompletion4 = true;_didIteratorError4 = false;_iteratorError4 = undefined;_context2.prev = 38;_iterator4 =
                deleteArray[Symbol.iterator]();case 40:if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {_context2.next = 47;break;}email = _step4.value;_context2.next = 44;return (
                  _userDb2.default.removeEmail(originalMessage.personEmail, parameters.email));case 44:_iteratorNormalCompletion4 = true;_context2.next = 40;break;case 47:_context2.next = 53;break;case 49:_context2.prev = 49;_context2.t1 = _context2['catch'](38);_didIteratorError4 = true;_iteratorError4 = _context2.t1;case 53:_context2.prev = 53;_context2.prev = 54;if (!_iteratorNormalCompletion4 && _iterator4.return) {_iterator4.return();}case 56:_context2.prev = 56;if (!_didIteratorError4) {_context2.next = 59;break;}throw _iteratorError4;case 59:return _context2.finish(56);case 60:return _context2.finish(53);case 61:

                (0, _formatters.sendResponse)(response, 'Successfully removed emails ' + deleteArray.toString() + '.');_context2.next = 65;break;case 64:

                (0, _formatters.sendResponse)(response, 'No email addresses found that could be removed. ');case 65:case 'end':return _context2.stop();}}}, _callee2, _this, [[18, 22, 26, 34], [27,, 29, 33], [38, 49, 53, 61], [54,, 56, 60]]);}));return function userDelete() {return _ref2.apply(this, arguments);};}(),




    'user.delete.number': function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {var user, deletedUsers, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, number;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                console.log('Delete by number webhook triggered. ');_context3.next = 3;return (
                  _userDb2.default.getUser(originalMessage.personEmail));case 3:user = _context3.sent;if (!(
                user.iotGroup && parameters.number)) {_context3.next = 41;break;}
                deletedUsers = [];
                /* eslint-disable */_iteratorNormalCompletion5 = true;_didIteratorError5 = false;_iteratorError5 = undefined;_context3.prev = 9;_iterator5 =
                parameters.number[Symbol.iterator]();case 11:if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {_context3.next = 24;break;}number = _step5.value;if (!(
                number - 1 < user.iotGroup.length)) {_context3.next = 19;break;}
                deletedUsers.push(user.iotGroup[number - 1]);_context3.next = 17;return (
                  user.update({ $pull: { iotGroup: user.iotGroup[number - 1] } }).exec());case 17:_context3.next = 21;break;case 19:

                (0, _formatters.sendResponse)(response, 'Invalid entry ' + number + '. Could not remove. ');return _context3.abrupt('return');case 21:_iteratorNormalCompletion5 = true;_context3.next = 11;break;case 24:_context3.next = 30;break;case 26:_context3.prev = 26;_context3.t0 = _context3['catch'](9);_didIteratorError5 = true;_iteratorError5 = _context3.t0;case 30:_context3.prev = 30;_context3.prev = 31;if (!_iteratorNormalCompletion5 && _iterator5.return) {_iterator5.return();}case 33:_context3.prev = 33;if (!_didIteratorError5) {_context3.next = 36;break;}throw _iteratorError5;case 36:return _context3.finish(33);case 37:return _context3.finish(30);case 38:



                /* eslint-enable */
                (0, _formatters.sendResponse)(response, 'Deleted user(s) ' + deletedUsers.toString() + ' successfully.');_context3.next = 42;break;case 41:
                (0, _formatters.sendResponse)(response, 'Invalid request. Error Deleting User. ');case 42:case 'end':return _context3.stop();}}}, _callee3, _this, [[9, 26, 30, 38], [31,, 33, 37]]);}));return function userDeleteNumber() {return _ref3.apply(this, arguments);};}(),

    'user.list': function () {var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {var user, personStr;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
                  _userDb2.default.getUser(originalMessage.personEmail));case 2:user = _context4.sent;
                personStr = (0, _formatters.getPersonStr)(user);
                if (personStr) {
                  (0, _formatters.sendResponse)(response, 'Here is your notification list: ');
                  Spark.messages.create({
                    roomId: originalMessage.roomId,
                    markdown: '' + personStr });

                } else {
                  (0, _formatters.sendResponse)(response, 'Sorry you have no one in your list. ');
                }case 5:case 'end':return _context4.stop();}}}, _callee4, _this);}));return function userList() {return _ref4.apply(this, arguments);};}(),

    'endpoint.get': function () {var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {var user, sampleJson, payload, link, comments, curl, mdMessage;return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return (
                  _userDb2.default.getUser(originalMessage.personEmail));case 2:user = _context5.sent;
                if (user) {
                  sampleJson = {
                    id: user._id,
                    title: 'Your Event Title',
                    data: 'Optional Data Message to be sent. ',
                    call: false };

                  payload = JSON.stringify(sampleJson, null, 2);
                  link = 'https://us-central1-incident-response-626e6.cloudfunctions.net/iotEvent';
                  comments = '// data and call are optional. \r\n// call is a true|false argument.';
                  curl = 'curl -d \'' + JSON.stringify(sampleJson) + '\' -H "Content-Type: application/json" -X POST ' + link;
                  mdMessage = 'Use the following [link](https://us-central1-incident-response-626e6.cloudfunctions.net/iotEvent) and send a HTTP POST request with  ';
                  mdMessage += 'JSON Body:\r\n``` javascript\r\n' + payload + '\r\n' + comments + '\r\n' + curl + '\r\n```';
                  Spark.messages.create({
                    roomId: originalMessage.roomId,
                    markdown: mdMessage });

                  response.end();
                } else {
                  (0, _formatters.sendResponse)('Looks like you have not added any users yet. Please finish configuration first.');
                }case 4:case 'end':return _context5.stop();}}}, _callee5, _this);}));return function endpointGet() {return _ref5.apply(this, arguments);};}(),

    'user.messages.add': function () {var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:if (!
                parameters.message) {_context6.next = 12;break;}_context6.prev = 1;_context6.next = 4;return (

                  _userDb2.default.addMessage(originalMessage.personEmail, parameters.message));case 4:
                (0, _formatters.sendResponse)(response, 'Successfully Updated IOT Event Message');_context6.next = 10;break;case 7:_context6.prev = 7;_context6.t0 = _context6['catch'](1);

                (0, _formatters.sendResponse)(response, 'Error updating your message. ');case 10:_context6.next = 13;break;case 12:

                (0, _formatters.sendResponse)(response, 'No message specified. ');case 13:case 'end':return _context6.stop();}}}, _callee6, _this, [[1, 7]]);}));return function userMessagesAdd() {return _ref6.apply(this, arguments);};}(),

    'user.messages.get': function () {var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {var user;return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:_context7.prev = 0;_context7.next = 3;return (

                  _userDb2.default.getUser(originalMessage.personEmail));case 3:user = _context7.sent;
                (0, _formatters.sendResponse)(response, 'Your Event message is: ' + user.iotMessage);_context7.next = 10;break;case 7:_context7.prev = 7;_context7.t0 = _context7['catch'](0);
                (0, _formatters.sendResponse)(response, 'Error Getting Message');case 10:case 'end':return _context7.stop();}}}, _callee7, _this, [[0, 7]]);}));return function userMessagesGet() {return _ref7.apply(this, arguments);};}(),

    'event.fire': function eventFire() {
      (0, _utils.fireEvent)({ email: originalMessage.personEmail, title: parameters.title });
      (0, _formatters.sendResponse)(response, 'Starting IOT Event');
    },
    // Default handler for unknown or undefined actions
    default: function _default() {
      var responseToUser = {
        speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor!', // spoken response
        displayText: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
      };
      (0, _formatters.sendResponse)(response, responseToUser);
    } };


  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }

  // Run the proper handler function to handle the request from Dialogflow
  actionHandlers[action]();
}

exports.dialogflowFulfillment = functions.https.onRequest(fulfillment);