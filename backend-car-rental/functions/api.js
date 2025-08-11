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


app.use('/blogs', blogRoutes);
app.use('/categories', categoryRoutes);
app.use('/cars', carRoutes);
app.use('/contact', contactRoutes);
app.use('/reviews', reviewRoutes);
app.use('/homepage', homepageRoutes);
app.use('/about', aboutRoutes);
app.use('/chats', chatRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);

module.exports.handler = serverless(app);
