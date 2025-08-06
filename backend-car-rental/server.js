// backend-car-rental/server.js
require('dotenv').config();
const mongoose = require('mongoose');
const app      = require('./app');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & start server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

connectDB();
