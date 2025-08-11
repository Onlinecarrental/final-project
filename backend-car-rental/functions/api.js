// backend-car-rental/functions/api.js
require('dotenv').config();
const mongoose   = require('mongoose');
const serverless = require('serverless-http');
const app        = require('../app');

const blogRoutes = require('../routes/blogRoutes');
const categoryRoutes = require('../routes/categoryRoutes');
const carRoutes = require('../routes/carRoutes');
const contactRoutes = require('../routes/contactRoutes');
const reviewRoutes = require('../routes/reviewRoutes');
const homepageRoutes = require('../routes/homepageRoutes');
const aboutRoutes = require('../routes/aboutRoutes');
const chatRoutes = require('../routes/chatRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const paymentRoutes = require('../routes/paymentRoutes');

let conn = null;

const connectToDatabase = async () => {
  if (conn && conn.readyState === 1) return;
  conn = await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected (Function bootstrap)');
};


app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

module.exports.handler = serverless(app);
