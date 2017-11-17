'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);





































/**
                                                                                                                                                                                                                                                                               * Function to start IOT Incident / Event
                                                                                                                                                                                                                                                                               * @async
                                                                                                                                                                                                                                                                               * @param {Object} options {
                                                                                                                                                                                                                                                                               * @param {string} options.email,
                                                                                                                                                                                                                                                                               * @param {string} options.title = 'IOT Event',
                                                                                                                                                                                                                                                                               * @param {string} options.data = undefined,
                                                                                                                                                                                                                                                                               * @param {boolean} options.call,
                                                                                                                                                                                                                                                                               * }
                                                                                                                                                                                                                                                                               */var fireEvent = function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(
  function _callee2(options) {var id, email, _options$title, title, _options$data, data, call, user, _user, iotMessage, iotGroup, timeString, room, memberships, roomDetail;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:

            id =




            options.id, email = options.email, _options$title = options.title, title = _options$title === undefined ? 'IOT Event' : _options$title, _options$data = options.data, data = _options$data === undefined ? undefined : _options$data, call = options.call;
            user = void 0;_context2.prev = 2;if (!

            id) {_context2.next = 7;break;}_context2.next = 6;return (
              db.getUserbyId(id));case 6:user = _context2.sent;case 7:if (!

            email) {_context2.next = 11;break;}_context2.next = 10;return (
              db.getUser(email));case 10:user = _context2.sent;case 11:_context2.next = 17;break;case 13:_context2.prev = 13;_context2.t0 = _context2['catch'](2);


            console.error(_context2.t0);throw (
              new Error('Could not get user'));case 17:if (

            user) {_context2.next = 19;break;}throw (
              new Error('No user found'));case 19:_context2.prev = 19;_user =


            user, iotMessage = _user.iotMessage, iotGroup = _user.iotGroup;if (!(
            iotMessage && iotGroup)) {_context2.next = 39;break;}
            timeString = moment().format('MMM Do - h:mm a');_context2.next = 25;return (
              Spark.rooms.create({
                title: title + ' @ ' + timeString }));case 25:room = _context2.sent;

            memberships = [];
            iotGroup.forEach(function (member) {
              var p = Spark.memberships.create({
                roomId: room.id,
                personEmail: member });

              memberships.push(p);
            });_context2.next = 30;return (
              Promise.all(memberships));case 30:_context2.next = 32;return (
              Spark.messages.create({
                roomId: room.id,
                markdown: iotMessage,
                text: iotMessage }));case 32:

            if (data) {
              Spark.messages.create({
                roomId: room.id,
                markdown: 'Data Sent: ' + data,
                text: 'Data Sent: ' + data });

            }if (!
            call) {_context2.next = 39;break;}_context2.next = 36;return (
              Spark.rooms.get(room.id));case 36:roomDetail = _context2.sent;
            console.log('Room Detail: ' + JSON.stringify(roomDetail));
            sipCall(roomDetail.sipAddress);case 39:_context2.next = 45;break;case 41:_context2.prev = 41;_context2.t1 = _context2['catch'](19);



            console.error(_context2.t1);throw (
              new Error('Error in Firiring Event through Spark.'));case 45:case 'end':return _context2.stop();}}}, _callee2, this, [[2, 13], [19, 41]]);}));return function fireEvent(_x2) {return _ref2.apply(this, arguments);};}();function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _require = require('../config'),SPARK_TOKEN = _require.SPARK_TOKEN,TROPO_TOKEN = _require.TROPO_TOKEN;var superagent = require('superagent');var moment = require('moment');var Spark = require('ciscospark').init({ credentials: { authorization: { access_token: SPARK_TOKEN } } });var db = require('./userDb'); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Helper function - uses tropo to start a SIP call to the specified address.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @async
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @param {string} address Address needed to start SIP call.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */var sipCall = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(address) {var payload;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:payload = { token: TROPO_TOKEN, action: 'create', network: 'SIP', numberToDial: 'sip:' + address, msg: 'Starting IOT Call.. Please wait for others to join. Blah blah blah blah blah blah blah blah blah blah blah blah blah blah seconds one two three four five six seven eight nine ten elevent twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty one twenty two twenty three twenty four twenty five twenty six twenty seven twenty eight twenty nine thirty ', callerID: '80085' };_context.prev = 1;console.log('Sending Tropo API Call.');_context.next = 5;return superagent.post('https://api.tropo.com/1.0/sessions').send(payload);case 5:_context.next = 11;break;case 7:_context.prev = 7;_context.t0 = _context['catch'](1);console.error(_context.t0);throw new Error('Could not send call through Tropo');case 11:case 'end':return _context.stop();}}}, _callee, undefined, [[1, 7]]);}));return function sipCall(_x) {return _ref.apply(this, arguments);};}();exports.sipCall = sipCall;exports.fireEvent = fireEvent;