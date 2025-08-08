// backend-car-rental/functions/api.js
require('dotenv').config();
const mongoose   = require('mongoose');
const serverless = require('serverless-http');
const app        = require('../app');

let conn = null;

const connectToDatabase = async () => {
  if (conn && conn.readyState === 1) return;
  conn = await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected (Function bootstrap)');
};

module.exports.handler = async (event, context) => {
  await connectToDatabase();
  return serverless(app)(event, context);
};
