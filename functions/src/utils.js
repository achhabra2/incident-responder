const { SPARK_TOKEN, TROPO_TOKEN } = require('../config');
const superagent = require('superagent');
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
    console.error(error);
    throw new Error('Could not send call through Tropo');
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
async function fireEvent(options) {
  const {
    id,
    email,
    title = 'IOT Event',
    data = undefined,
    call,
  } = options;
  let user;
  try {
    if (id) {
      user = await db.getUserbyId(id);
    }
    if (email) {
      user = await db.getUser(email);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Could not get user');
  }
  if (!user) {
    throw new Error('No user found');
  }
  try {
    const { iotMessage, iotGroup } = user;
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
        await Spark.messages.create({
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
    } else {
      throw new Error('Error in Firiring Event through Spark.');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error in Firiring Event through Spark.');
  }
}

exports.sipCall = sipCall;
exports.fireEvent = fireEvent;
