const express = require('express');
const router = express.Router();
const { getCV, uploadCV, deleteCV } = require('../controllers/cv.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.route('/').get(getCV).delete(protect, deleteCV);
router.route('/upload').post(protect, upload.single('cv'), uploadCV);

module.exports = router;
