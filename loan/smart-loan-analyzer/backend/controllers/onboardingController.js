const User = require('../models/User');
const Loan = require('../models/Loan');

/**
 * POST /api/onboarding/complete
 * Saves wizard data and marks onboarding as complete.
 *
 * Body:
 * {
 *   monthlyIncome: Number,      // required > 0
 *   monthlyExpenses: Number,    // required >= 0
 *   savings: Number,            // >= 0
 *   emergencyFundAmount: Number,// >= 0
 *   occupation: String,
 *   loans: [                    // optional array of existing loans
 *     {
 *       type: String,
 *       amount: Number,
 *       interestRate: Number,
 *       emiAmount: Number,
 *       tenureMonths: Number
 *     }
 *   ]
 * }
 */
exports.completeOnboarding = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const {
      monthlyIncome,
      monthlyExpenses,
      savings,
      emergencyFundAmount,
      occupation,
      loans = [],
    } = req.body;

    // Validation
    if (!monthlyIncome || Number(monthlyIncome) <= 0) {
      return res.status(400).json({ success: false, message: 'Monthly income must be greater than 0' });
    }
    if (monthlyExpenses == null || Number(monthlyExpenses) < 0) {
      return res.status(400).json({ success: false, message: 'Monthly expenses must be 0 or greater' });
    }
    if (savings != null && Number(savings) < 0) {
      return res.status(400).json({ success: false, message: 'Savings must be 0 or greater' });
    }

    // Update user financial profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          onboardingCompleted: true,
          monthlyIncome: Number(monthlyIncome),
          monthlyExpenses: Number(monthlyExpenses),
          savings: Number(savings || 0),
          emergencyFundAmount: Number(emergencyFundAmount || 0),
          occupation: String(occupation || ''),
        },
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

    // Save any loans entered during onboarding
    if (Array.isArray(loans) && loans.length > 0) {
      const loanDocs = loans
        .filter(l => l.amount && l.interestRate && l.tenureMonths)
        .map(l => ({
          userId,
          type: l.type || 'Personal Loan',
          name: l.type || 'Personal Loan',
          amount: Number(l.amount),
          interestRate: Number(l.interestRate),
          tenureMonths: Number(l.tenureMonths),
          status: 'ACTIVE',
          startDate: new Date(),
        }));

      if (loanDocs.length > 0) {
        await Loan.insertMany(loanDocs);
        console.log(`[Onboarding] Created ${loanDocs.length} loan(s) for user ${userId}`);
      }
    }

    console.log(`[Onboarding] Completed for user ${userId} — Income: ₹${monthlyIncome}, Expenses: ₹${monthlyExpenses}`);

    return res.json({
      success: true,
      message: 'Onboarding completed successfully!',
      data: {
        onboardingCompleted: true,
        monthlyIncome: updatedUser.monthlyIncome,
        monthlyExpenses: updatedUser.monthlyExpenses,
        savings: updatedUser.savings,
        emergencyFundAmount: updatedUser.emergencyFundAmount,
        occupation: updatedUser.occupation,
      },
    });
  } catch (e) {
    console.error('[Onboarding] Error:', e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * GET /api/onboarding/status
 * Returns whether the user has completed onboarding.
 */
exports.getOnboardingStatus = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await User.findById(userId).select('onboardingCompleted monthlyIncome monthlyExpenses');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({
      success: true,
      data: {
        onboardingCompleted: user.onboardingCompleted || false,
        monthlyIncome: user.monthlyIncome || 0,
        monthlyExpenses: user.monthlyExpenses || 0,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
