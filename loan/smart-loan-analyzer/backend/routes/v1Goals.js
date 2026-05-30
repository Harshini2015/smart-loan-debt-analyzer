const express = require('express');
const goalsRouter = require('./goals');

const router = express.Router();

// Compatibility: spec expects /api/goals/* (no /v2)
router.use('/', goalsRouter);

module.exports = router;

