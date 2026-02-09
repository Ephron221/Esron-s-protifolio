const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/about.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(getAbout).put(protect, updateAbout);

module.exports = router;
