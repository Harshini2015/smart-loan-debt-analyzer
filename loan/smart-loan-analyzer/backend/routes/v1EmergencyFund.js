const express = require('express');
const emergencyFundRouter = require('./emergencyFund');

const router = express.Router();

// Compatibility: spec expects /api/fund/* (no /v2)
router.use('/', emergencyFundRouter);

module.exports = router;

