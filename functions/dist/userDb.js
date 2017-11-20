'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.findDuplicates = exports.getUserbyId = exports.getUser = exports.addMessage = exports.removeEmail = exports.addEmail = undefined;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _config = require('../config');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// Connection Strings to MongoDB Instance
_mongoose2.default.Promise = global.Promise;

_mongoose2.default.connect(_config.MONGO_URI,

{ useMongoClient: true }).
then(function (db) {
  console.log('Connected to MongoDB: ' + db);
}).catch(function (err) {
  console.error(err);
});

// Defining MongoDB Schema for the users
/**
 * @constructor
 */
var userSchema = new _mongoose.Schema({
  displayName: String,
  email: String,
  createdOn: {
    type: Date,
    default: Date.now() },

  iotGroup: [String],
  iotMessage: String });


/**
                          * @typedef {object} User
                          * @property {string} email
                          * @property {string[]} iotGroup
                          * @property {string} iotMessage
                          */
var User = _mongoose2.default.model('iotUser', userSchema);

/**
                                                             * @param {number} personEmail
                                                             * @param {string} email
                                                             * @returns {Promise<User>}
                                                             */
var addEmail = exports.addEmail = function addEmail(personEmail, email) {return User.findOneAndUpdate({ email: personEmail }, { $push: { iotGroup: email } }, { new: true, upsert: true }).exec();};

/**
                                                                                                                                                                                                      * @param {string} personEmail
                                                                                                                                                                                                      * @param {string} email
                                                                                                                                                                                                      * @returns {Promise<User>}
                                                                                                                                                                                                      */
var removeEmail = exports.removeEmail = function removeEmail(personEmail, email) {return User.findOneAndUpdate({ email: personEmail }, { $pull: { iotGroup: email } }, { new: true, upsert: true }).exec();};

/**
                                                                                                                                                                                                               * @param {string} personEmail Spark User's email
                                                                                                                                                                                                               * @param {string} message
                                                                                                                                                                                                               * @returns {Promise<User>}
                                                                                                                                                                                                               */
var addMessage = exports.addMessage = function addMessage(personEmail, message) {return User.findOneAndUpdate({ email: personEmail }, { iotMessage: message }, { new: true, upsert: true }).exec();};

/**
                                                                                                                                                                                                       * @param {string} email Spark User's email
                                                                                                                                                                                                       * @returns {Promise<User>}
                                                                                                                                                                                                       */
var getUser = exports.getUser = function getUser(email) {return User.findOne({ email: email }).exec();};

/**
                                                                                                          * @param {string} stringId MongoDB ObjectID
                                                                                                          * @returns {Promise<User>}
                                                                                                          */
var getUserbyId = exports.getUserbyId = function getUserbyId(stringId) {
  var id = new _mongoose2.default.Types.ObjectId(stringId);
  return User.findById(id).exec();
};

var findDuplicates = exports.findDuplicates = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(personEmail, emails) {var user, duplicates, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, email;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
              getUser(personEmail));case 2:user = _context.sent;
            duplicates = [];if (!(
            user && user.iotGroup)) {_context.next = 24;break;}
            /* eslint-disable */_iteratorNormalCompletion = true;_didIteratorError = false;_iteratorError = undefined;_context.prev = 8;
            for (_iterator = emails[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {email = _step.value;
              if (user.iotGroup.indexOf(email) != -1) {
                duplicates.push(email);
              }
            }
            /* eslint-enable */_context.next = 16;break;case 12:_context.prev = 12;_context.t0 = _context['catch'](8);_didIteratorError = true;_iteratorError = _context.t0;case 16:_context.prev = 16;_context.prev = 17;if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}case 19:_context.prev = 19;if (!_didIteratorError) {_context.next = 22;break;}throw _iteratorError;case 22:return _context.finish(19);case 23:return _context.finish(16);case 24:return _context.abrupt('return',

            duplicates);case 25:case 'end':return _context.stop();}}}, _callee, undefined, [[8, 12, 16, 24], [17,, 19, 23]]);}));return function findDuplicates(_x, _x2) {return _ref.apply(this, arguments);};}();exports.default =


{
  addEmail: addEmail,
  removeEmail: removeEmail,
  addMessage: addMessage,
  getUser: getUser,
  getUserbyId: getUserbyId,
  findDuplicates: findDuplicates };