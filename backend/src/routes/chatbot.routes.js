const express = require('express');
const router = express.Router();
const { getChatbotResponse } = require('../controllers/chatbot.controller');

router.post('/', getChatbotResponse);

module.exports = router;
