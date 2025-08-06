// backend-car-rental/app.js
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');

// Import route modules
const carRoutes       = require('./routes/carRoutes');
const contactRoutes   = require('./routes/contactRoutes');
const blogRoutes      = require('./routes/blogRoutes');
const categoryRoutes  = require('./routes/categoryRoutes');
const reviewRoutes    = require('./routes/reviewRoutes');
const homepageRoutes  = require('./routes/homepageRoutes');
const aboutRoutes     = require('./routes/aboutRoutes');
const chatRoutes      = require('./routes/chatRoutes');
const bookingRoutes   = require('./routes/bookingRoutes');
const paymentRoutes   = require('./routes/paymentRoutes');

const app = express();

// === LOCAL-FS SETUP ===
// Skip this block if running inside Netlify Functions
if (!process.env.NETLIFY) {
  // Ensure upload directories exist
  const directories = [
    'uploads',
    'uploads/cars',
    'uploads/blogs',
    'uploads/reviews',
    'uploads/reviews/profiles',
    'uploads/homepage',
    'uploads/about',
    'uploads/about/services',
    'uploads/about/trust',
    'uploads/about/cars'
  ];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Serve uploads folder in local dev
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// === CORS SETUP ===
const allowedOrigins = [
  'https://onlinecarrental234.netlify.app',  // your Netlify frontend
  'http://localhost:5173'                    // local Vite dev
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health-check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount API routes
app.use('/api/cars',       carRoutes);
app.use('/api/contact',    contactRoutes);
app.use('/api/blogs',      blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/homepage',   homepageRoutes);
app.use('/api/about',      aboutRoutes);
app.use('/api/chats',      chatRoutes);
app.use('/api/bookings',   bookingRoutes);
app.use('/api/payments',   paymentRoutes);

// 404 for unknown API routes
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'API route not found',
      path: req.url,
      method: req.method,
    });
  }
  next();
});

// Error handler (including Multer cleanup)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE'
        ? 'File size is too large'
        : 'File upload error',
      error: err.message,
    });
  }

  // Cleanup uploaded files on error (local dev only)
  if (req.file) {
    fs.unlink(req.file.path, () => {});
  }
  if (req.files) {
    Object.values(req.files).flat().forEach(f => {
      if (fs.existsSync(f.path)) {
        fs.unlink(f.path, () => {});
      }
    });
  }

  console.error('Error details:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development'
      ? { stack: err.stack }
      : {},
  });
});

// Global unhandled promise/exception handlers
process.on('unhandledRejection', error => {
  console.error('Unhandled Rejection:', error);
  if (process.env.NODE_ENV === 'production') process.exit(1);
});
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  if (process.env.NODE_ENV === 'production') process.exit(1);
});

module.exports = app;
