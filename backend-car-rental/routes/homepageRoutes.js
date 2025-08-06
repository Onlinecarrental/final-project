// backend-car-rental/routes/homepageRoutes.js
const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const homepageController = require('../controllers/homepageController');

// Determine storage strategy:
// - Locally (no NETLIFY env var): store files under /uploads/homepage
// - In Functions (NETLIFY=true): use memoryStorage
const isServerless = !!process.env.NETLIFY;

const storage = isServerless
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const dir = 'uploads/homepage';
        // Safe-guard: only runs locally
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
          null,
          `${req.params.sectionType}-${uniqueSuffix}${path.extname(
            file.originalname
          )}`
        );
      }
    });

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Validation middleware
const validateSection = (req, res, next) => {
  const valid = ['hero', 'services', 'howItWorks', 'whyChoose', 'faqs'];
  if (!valid.includes(req.params.sectionType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid section type'
    });
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

// 404 for unmatched
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Homepage section not found'
  });
});

module.exports = router;
