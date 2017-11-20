import mongoose, { Schema } from 'mongoose';
import { MONGO_URI } from '../config';

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
 * @property {string} email
 * @property {string[]} iotGroup
 * @property {string} iotMessage
 */
const User = mongoose.model('iotUser', userSchema);

/**
 * @param {number} personEmail
 * @param {string} email
 * @returns {Promise<User>}
 */
export const addEmail = (personEmail, email) => User.findOneAndUpdate({ email: personEmail }, { $push: { iotGroup: email } }, { new: true, upsert: true }).exec();

/**
 * @param {string} personEmail
 * @param {string} email
 * @returns {Promise<User>}
 */
export const removeEmail = (personEmail, email) => User.findOneAndUpdate({ email: personEmail }, { $pull: { iotGroup: email } }, { new: true, upsert: true }).exec();

/**
 * @param {string} personEmail Spark User's email
 * @param {string} message
 * @returns {Promise<User>}
 */
export const addMessage = (personEmail, message) => User.findOneAndUpdate({ email: personEmail }, { iotMessage: message }, { new: true, upsert: true }).exec();

/**
 * @param {string} email Spark User's email
 * @returns {Promise<User>}
 */
export const getUser = email => User.findOne({ email }).exec();

/**
 * @param {string} stringId MongoDB ObjectID
 * @returns {Promise<User>}
 */
export const getUserbyId = (stringId) => {
  const id = new mongoose.Types.ObjectId(stringId);
  return User.findById(id).exec();
};

export const findDuplicates = async (personEmail, emails) => {
  const user = await getUser(personEmail);
  const duplicates = [];
  if (user && user.iotGroup) {
    /* eslint-disable */
    for (const email of emails) {
      if (user.iotGroup.indexOf(email) != -1) {
        duplicates.push(email);
      }
    }
    /* eslint-enable */
  }
  return duplicates;
};

export default {
  addEmail,
  removeEmail,
  addMessage,
  getUser,
  getUserbyId,
  findDuplicates,
};
