const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');

// Public AI chat endpoint (validates input server-side)
router.post('/chat', chat);

module.exports = router;
