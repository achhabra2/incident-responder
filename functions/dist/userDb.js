'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.getUserbyId = exports.getUser = exports.addMessage = exports.removeEmail = exports.addEmail = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
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
};exports.default =

{
  addEmail: addEmail,
  removeEmail: removeEmail,
  addMessage: addMessage,
  getUser: getUser,
  getUserbyId: getUserbyId };