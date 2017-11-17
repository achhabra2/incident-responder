'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);



/**
                                                                                                                                                                                                                                                                               * Firebase function export handling http request and response (req,res)
                                                                                                                                                                                                                                                                               * @param {object} request HTTP Request
                                                                                                                                                                                                                                                                               * @param {string} request.body.email Email Address
                                                                                                                                                                                                                                                                               * @param {string} request.body.title Title for IOT Event
                                                                                                                                                                                                                                                                               * @param {string} request.body.data Data to display
                                                                                                                                                                                                                                                                               * @param {boolean} request.body.call Start SIP Call (true|false)
                                                                                                                                                                                                                                                                               * @param {Object} response HTTP Response
                                                                                                                                                                                                                                                                               */var receiveIotEvent = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(
  function _callee(req, res) {var _req$body, id, email, title, data, call;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            console.log('Request headers: ' + JSON.stringify(req.headers));
            console.log('Request body: ' + JSON.stringify(req.body));_req$body =


            req.body, id = _req$body.id, email = _req$body.email, title = _req$body.title, data = _req$body.data, call = _req$body.call;if (!(
            email && title)) {_context.next = 15;break;}_context.prev = 4;_context.next = 7;return (

              fireEvent({
                email: email, title: title, data: data, call: call }));case 7:

            res.end();_context.next = 13;break;case 10:_context.prev = 10;_context.t0 = _context['catch'](4);

            res.status(500).send(_context.t0).end();case 13:_context.next = 29;break;case 15:if (!(

            id && title)) {_context.next = 28;break;}_context.prev = 16;_context.next = 19;return (

              fireEvent({
                id: id, title: title, data: data, call: call }));case 19:

            res.end();_context.next = 25;break;case 22:_context.prev = 22;_context.t1 = _context['catch'](16);

            res.status(500).send(_context.t1).end();case 25:

            res.end();_context.next = 29;break;case 28:
            res.status(400).end();case 29:case 'end':return _context.stop();}}}, _callee, this, [[4, 10], [16, 22]]);}));return function receiveIotEvent(_x, _x2) {return _ref.apply(this, arguments);};}();function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var functions = require('firebase-functions'); // Cloud Functions for Firebase library
var _require = require('./utils'),fireEvent = _require.fireEvent;


exports.fireEvent = fireEvent;
exports.iotEvent = functions.https.onRequest(receiveIotEvent);