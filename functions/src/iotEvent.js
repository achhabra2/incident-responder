const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const { fireEvent } = require('./utils');


/**
 * Firebase function export handling http request and response (req,res)
 * @param {object} request HTTP Request
 * @param {string} request.body.email Email Address
 * @param {string} request.body.title Title for IOT Event
 * @param {string} request.body.data Data to display
 * @param {boolean} request.body.call Start SIP Call (true|false)
 * @param {Object} response HTTP Response
 */
async function receiveIotEvent(req, res) {
  console.log(`Request headers: ${JSON.stringify(req.headers)}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  const {
    id, email, title, data, call,
  } = req.body;
  if (email && title) {
    try {
      await fireEvent({
        email, title, data, call,
      });
      res.end();
    } catch (error) {
      res.status(500).send(error).end();
    }
  } else if (id && title) {
    try {
      await fireEvent({
        id, title, data, call,
      });
      res.end();
    } catch (error) {
      res.status(500).send(error).end();
    }
    res.end();
  } else res.status(400).end();
}


exports.fireEvent = fireEvent;
exports.iotEvent = functions.https.onRequest(receiveIotEvent);
