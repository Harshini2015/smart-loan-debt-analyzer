const express = require('express');
const familyRouter = require('./family');

const router = express.Router();

// Compatibility: spec expects /api/family/* (no /v2)
router.use('/', familyRouter);

module.exports = router;

