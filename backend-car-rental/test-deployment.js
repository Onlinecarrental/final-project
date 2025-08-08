// Test script to verify serverless environment detection
const isServerless = !!process.env.LAMBDA_TASK_ROOT;

console.log('Environment check:');
console.log('LAMBDA_TASK_ROOT:', process.env.LAMBDA_TASK_ROOT);
console.log('AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME);
console.log('isServerless:', isServerless);

// Test multer configuration
const multer = require('multer');

const storage = isServerless
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/test');
      },
      filename: (req, file, cb) => {
        cb(null, 'test-file.jpg');
      }
    });

console.log('Storage type:', isServerless ? 'memoryStorage' : 'diskStorage');

console.log('✅ Deployment test completed successfully!');
