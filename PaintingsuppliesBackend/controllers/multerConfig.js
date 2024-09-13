// multerConfig.js

const multer = require('multer');
const path = require('path');

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // File name format: fieldname-timestamp.ext
  }
});

// File filter (optional) - restrict file types if needed
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// Initialize multer instance with configuration
const upload = multer({
  storage: storage,
//   fileFilter: fileFilter
});

module.exports = upload;
