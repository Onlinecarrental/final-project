// backend-car-rental/functions/api.js
require('dotenv').config();
const mongoose   = require('mongoose');
const serverless = require('serverless-http');
const app        = require('../app');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

let conn = null;

const connectToDatabase = async () => {
  if (conn && conn.readyState === 1) return;
  conn = await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected (Function bootstrap)');
};

app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);

module.exports.handler = serverless(app);
