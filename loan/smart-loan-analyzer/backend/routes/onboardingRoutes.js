const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  completeOnboarding,
  getOnboardingStatus,
} = require('../controllers/onboardingController');

// GET /api/onboarding/status
router.get('/status', auth, getOnboardingStatus);

// POST /api/onboarding/complete
router.post('/complete', auth, completeOnboarding);

module.exports = router;
