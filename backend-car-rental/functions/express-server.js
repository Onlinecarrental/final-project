// backend-car-rental/functions/express-server.js
const serverless = require('serverless-http');
const app        = require('../app');

module.exports.handler = serverless(app);

