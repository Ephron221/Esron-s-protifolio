const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const filePath = `/${req.file.path.replace(/\\/g, '/')}`;
  res.status(200).json({
    message: 'Image uploaded successfully',
    url: filePath
  });
});

module.exports = router;
