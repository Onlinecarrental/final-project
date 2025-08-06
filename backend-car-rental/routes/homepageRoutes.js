// backend-car-rental/routes/homepageRoutes.js
const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const homepageController = require('../controllers/homepageController');

// Detect Netlify Lambda by presence of LAMBDA_TASK_ROOT
const isServerless = !!process.env.LAMBDA_TASK_ROOT;

// Configure multer storage
const storage = isServerless
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const dir = 'uploads/homepage';
        // Only runs locally—never in Function
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${req.params.sectionType}-${suffix}${path.extname(file.originalname)}`);
      }
    });

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Validation
const valid = ['hero','services','howItWorks','whyChoose','faqs'];
const validateSection = (req, res, next) => {
  if (!valid.includes(req.params.sectionType)) {
    return res.status(400).json({ success: false, message: 'Invalid section type' });
  }
  next();
};

// Routes
router.get('/', homepageController.getAllSections);
router.get('/:sectionType', validateSection, homepageController.getSection);
router.patch(
  '/:sectionType',
  validateSection,
  upload.single('image'),
  homepageController.updateSection
);

// 404 fallback
router.use((req, res) => {
  res.status(404).json({ success: false, message: 'Homepage section not found' });
});

module.exports = router;
