const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const superagent = require('superagent');
const { SPARK_TOKEN, TROPO_TOKEN } = require('../config');
const moment = require('moment');
const Spark = require('ciscospark').init({
  credentials: {
    authorization: {
      access_token: SPARK_TOKEN,
    },
  },
});
const db = require('./userDb');

/**
 *
 * Helper function - uses tropo to start a SIP call to the specified address.
 * @async
 * @param {string} address Address needed to start SIP call.
 */
const sipCall = async (address) => {
  const payload = {
    token: TROPO_TOKEN,
    action: 'create',
    network: 'SIP',
    numberToDial: `sip:${address}`,
    msg: 'Starting IOT Call.. Please wait for others to join. Blah blah blah blah blah blah blah blah blah blah blah blah blah blah seconds one two three four five six seven eight nine ten elevent twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty one twenty two twenty three twenty four twenty five twenty six twenty seven twenty eight twenty nine thirty ',
    callerID: '80085',
  };
  try {
    console.log('Sending Tropo API Call.');
    await superagent
      .post('https://api.tropo.com/1.0/sessions')
      .send(payload);
  } catch (error) {
    console.log('Error sending call through Tropo');
    console.error(error);
  }
};

/**
 * Function to start IOT Incident / Event
 * @async
 * @param {Object} options {
 * @param {string} options.email,
 * @param {string} options.title = 'IOT Event',
 * @param {string} options.data = undefined,
 * @param {boolean} options.call,
 * }
 */
const fireEvent = async (options) => {
  const {
    email,
    title = 'IOT Event',
    data = undefined,
    call,
  } = options;
  try {
    const { iotMessage, iotGroup } = await db.getUser(email);
    if (iotMessage && iotGroup) {
      const timeString = moment().format('MMM Do - h:mm a');
      const room = await Spark.rooms.create({
        title: `${title} @ ${timeString}`,
      });
      const memberships = [];
      iotGroup.forEach((member) => {
        const p = Spark.memberships.create({
          roomId: room.id,
          personEmail: member,
        });
        memberships.push(p);
      });
      await Promise.all(memberships);
      await Spark.messages.create({
        roomId: room.id,
        markdown: iotMessage,
        text: iotMessage,
      });
      if (data) {
        Spark.messages.create({
          roomId: room.id,
          markdown: `Data Sent: ${data}`,
          text: `Data Sent: ${data}`,
        });
      }
      if (call) {
        const roomDetail = await Spark.rooms.get(room.id);
        console.log(`Room Detail: ${JSON.stringify(roomDetail)}`);
        sipCall(roomDetail.sipAddress);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Firebase function export handling http request and response (req,res)
 * @param {object} request HTTP Request
 * @param {string} request.body.email Email Address
 * @param {string} request.body.title Title for IOT Event
 * @param {string} request.body.data Data to display
 * @param {boolean} request.body.call Start SIP Call (true|false)
 * @param {Object} response HTTP Response
 */
const iotEvent = functions.https.onRequest((request, response) => {
  console.log(`Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Request body: ${JSON.stringify(request.body)}`);
  const {
    email, title, data, call,
  } = request.body;
  if (email) {
    fireEvent({
      email, title, data, call,
    });
    response.end();
  } else response.end();
});


exports.fireEvent = fireEvent;
exports.iotEvent = iotEvent;
