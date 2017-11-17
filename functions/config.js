const functions = require('firebase-functions');


module.exports = {
  MONGO_URI: process.env.MONGO_URI || functions.config().responder.mongouri,
  SPARK_TOKEN: process.env.SPARK_TOKEN || functions.config().responder.sparktoken,
  TROPO_TOKEN: process.env.TROPO_TOKEN || functions.config().responder.tropotoken,
};
