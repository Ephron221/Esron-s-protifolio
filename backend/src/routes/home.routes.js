const express = require('express');
const router = express.Router();
const { getHome, updateHome } = require('../controllers/home.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(getHome).put(protect, updateHome);

module.exports = router;
