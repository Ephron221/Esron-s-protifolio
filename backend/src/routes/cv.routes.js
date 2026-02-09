const express = require('express');
const router = express.Router();
const { getCV, uploadCV } = require('../controllers/cv.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.route('/').get(getCV);
router.route('/upload').post(protect, upload.single('cv'), uploadCV);

module.exports = router;
