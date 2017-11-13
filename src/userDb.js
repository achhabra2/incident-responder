const { MONGO_URI } = require('../config');

const mongoose = require('mongoose');

const { Schema } = mongoose;
// Connection Strings to MongoDB Instance
mongoose.Promise = global.Promise;

mongoose.connect(
  MONGO_URI,
  { useMongoClient: true },
).then((db) => {
  console.log(`Connected to MongoDB: ${db}`);
}).catch((err) => {
  console.error(err);
});

// Defining MongoDB Schema for the users
/**
 * @constructor
 */
const userSchema = new Schema({
  displayName: String,
  email: String,
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  iotGroup: [String],
  iotMessage: String,
});

/**
 * @typedef {object} User
 * @property {number} _id
 * @property {string} email
 * @property {string[]} iotGroup
 * @property {string} iotMessage
 */
const User = mongoose.model('iotUser', userSchema);

/**
 *
 *
 * @param {number} id
 * @param {string} email
 * @returns {Promise<User>}
 */
const addEmail = (id, email) => User.findOneAndUpdate({ email: id }, { $push: { iotGroup: email } }, { new: true, upsert: true }).exec();

/**
 *
 *
 * @param {number} id
 * @param {string} email
 * @returns {Promise<User>}
 */
const removeEmail = (id, email) => User.findOneAndUpdate({ email: id }, { $pull: { iotGroup: email } }, { new: true, upsert: true }).exec();

/**
 *
 *
 * @param {number} id
 * @param {string} message
 * @returns {Promise<User>}
 */
const addMessage = (id, message) => User.findOneAndUpdate({ email: id }, { iotMessage: message }, { new: true, upsert: true }).exec();

/**
 *
 *
 * @param {number} id
 * @returns {Promise<User>}
 */
const getUser = id => User.findOne({ email: id }).exec();


module.exports = {
  addEmail,
  removeEmail,
  addMessage,
  getUser,
};
