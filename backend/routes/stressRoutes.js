const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getCurrentStress,
  getStressTrend,
  getStressAnalysis,
} = require('../controllers/stressController');

// GET /api/stress/current
router.get('/current', auth, getCurrentStress);

// GET /api/stress/trend
router.get('/trend', auth, getStressTrend);

// GET /api/stress/analysis
router.get('/analysis', auth, getStressAnalysis);

// POST /api/stress/analyze (alias used by frontend stressService)
router.post('/analyze', auth, getStressAnalysis);

module.exports = router;
