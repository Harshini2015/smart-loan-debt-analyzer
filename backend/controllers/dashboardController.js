const User = require('../models/User');
const Loan = require('../models/Loan');
const EmergencyWallet = require('../models/EmergencyWallet');
const { emi } = require('../utils/finance');

// GET /api/dashboard (protected)
// Returns complete financial snapshot from MongoDB
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Fetch user profile
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Fetch all ACTIVE loans for this user
    const loans = await Loan.find({ userId, status: { $in: ['ACTIVE', 'Active', 'active'] } })
      .sort({ createdAt: -1 })
      .lean();

    // Get financial data from user profile
    const grossSalary = Number(user.grossSalary || 0);
    const pfPercentage = Number(user.pfPercentage || 12);
    const pfAmount = Number((grossSalary * (pfPercentage / 100)).toFixed(2));
    const professionalTax = Number(user.professionalTax || 0);
    const incomeTax = Number(user.incomeTax || 0);
    const netSalary = Math.max(0, grossSalary - pfAmount - professionalTax - incomeTax);

    const expenseRent = Number(user.expenseRent || 0);
    const expenseFood = Number(user.expenseFood || 0);
    const expenseTransport = Number(user.expenseTransport || 0);
    const expenseElectricity = Number(user.expenseElectricity || 0);
    const expenseInternet = Number(user.expenseInternet || 0);
    const expenseInsurance = Number(user.expenseInsurance || 0);
    const expenseOther = Number(user.expenseOther || 0);

    const totalExpenses = expenseRent + expenseFood + expenseTransport + expenseElectricity + expenseInternet + expenseInsurance + expenseOther;

    const monthlyIncome = grossSalary > 0 ? netSalary : Number(user.monthlyIncome || 0);
    const monthlyExpenses = totalExpenses > 0 ? totalExpenses : Number(user.monthlyExpenses || user.monthlyExpense || 0);
    const disposableIncome = Math.max(0, monthlyIncome - monthlyExpenses);

    // Calculate EMI for each loan using standard EMI formula
    const loansWithEmi = loans.map(l => ({
      ...l,
      _emi: emi(
        Number(l.amount || 0),
        Number(l.interestRate || 0),
        Number(l.tenureMonths || l.duration || 0)
      )
    }));

    // Total EMI = sum of all individual loan EMIs
    const totalEMI = Number(
      loansWithEmi.reduce((sum, l) => sum + (l._emi || 0), 0).toFixed(2)
    );

    // ─────────────────────────────────────────────────────────
    //  DEBT STRESS SCORE — DTI (Debt-to-Income) based formula
    //  Formula: debtStress = (totalEMI / monthlyIncome) × 100
    //
    //  Risk Categories:
    //    0–20%   → Healthy
    //    20–35%  → Moderate
    //    35–50%  → High
    //    >50%    → Critical
    // ─────────────────────────────────────────────────────────
    const dtiPercent = monthlyIncome > 0
      ? parseFloat(((totalEMI / monthlyIncome) * 100).toFixed(2))
      : 0;

    let stressCategory;
    if (dtiPercent <= 20) stressCategory = 'Healthy';
    else if (dtiPercent <= 35) stressCategory = 'Moderate';
    else if (dtiPercent <= 50) stressCategory = 'High';
    else stressCategory = 'Critical';

    // Debug logs to verify calculation pipeline
    console.log('─────────────── Dashboard DTI Calculation ───────────────');
    console.log(`[DTI] Monthly Income     : ₹${monthlyIncome.toLocaleString('en-IN')}`);
    console.log(`[DTI] Monthly Expenses   : ₹${monthlyExpenses.toLocaleString('en-IN')}`);
    console.log(`[DTI] Disposable Income  : ₹${disposableIncome.toLocaleString('en-IN')}`);
    console.log(`[DTI] Active Loans Count : ${loans.length}`);
    console.log(`[DTI] Total EMI          : ₹${totalEMI.toLocaleString('en-IN')}`);
    console.log(`[DTI] DTI %              : ${dtiPercent}%`);
    console.log(`[DTI] Stress Category    : ${stressCategory}`);
    console.log('──────────────────────────────────────────────────────────');

    // Format recent loans for display
    const recentLoans = loans.slice(0, 5).map(l => ({
      id: l._id,
      loanType: l.type || l.name || 'Loan',
      type: l.type || l.name || 'Loan',
      amount: l.amount,
      interestRate: l.interestRate,
      tenureMonths: l.tenureMonths || l.duration || 0,
      emi: emi(
        Number(l.amount || 0),
        Number(l.interestRate || 0),
        Number(l.tenureMonths || l.duration || 0)
      ),
      createdAt: l.createdAt,
      status: l.status || 'ACTIVE'
    }));

    // Stress trend: DTI % per month (same formula, consistent units)
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const stressTrend = months.map(month => ({
      month,
      stress: dtiPercent  // All months show current DTI until historical data exists
    }));

    // ─── Emergency Fund health summary ───────────────────────────────────────
    let emergencyFund = null;
    try {
      const wallet = await EmergencyWallet.findOne({ userId });
      if (wallet) {
        const efExpenses = wallet.monthlyExpenses || monthlyExpenses || 1;
        const runwayMonths = wallet.balance > 0
          ? parseFloat((wallet.balance / efExpenses).toFixed(1))
          : 0;
        const percentage = wallet.targetAmount > 0
          ? Math.min(100, Math.round((wallet.balance / wallet.targetAmount) * 100))
          : 0;
        emergencyFund = {
          balance:      wallet.balance,
          targetAmount: wallet.targetAmount,
          runwayMonths,
          percentage,
          savingMode:   wallet.savingMode,
        };
      }
    } catch (efErr) {
      console.warn('[Dashboard] Emergency fund fetch skipped:', efErr.message);
    }

    // Return single source of truth
    return res.json({
      success: true,
      data: {
        monthlyIncome,
        monthlyExpenses,
        disposableIncome,
        totalEMI,
        dtiPercent,
        stressScore: dtiPercent,          // DTI % (0–100 scale, real value)
        stressCategory,                   // Healthy / Moderate / High / Critical
        emiRatio: monthlyIncome > 0
          ? parseFloat((totalEMI / monthlyIncome).toFixed(4))
          : 0,
        recentLoans,
        stressTrend,
        loansCount: loans.length,
        onboardingCompleted: user.onboardingCompleted || false,
        emergencyFund,
        grossSalary,
        pfPercentage,
        pfAmount,
        professionalTax,
        incomeTax,
        netSalary,
        expenseRent,
        expenseFood,
        expenseTransport,
        expenseElectricity,
        expenseInternet,
        expenseInsurance,
        expenseOther,
        totalExpenses
      }
    });
  } catch (e) {
    console.error('Dashboard controller error:', e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Alias for getDashboard
exports.getDashboardData = exports.getDashboard;

// PUT /api/dashboard/financial-info
exports.updateFinancialInfo = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const {
      monthlyIncome,
      monthlyExpenses,
      grossSalary,
      pfPercentage,
      professionalTax,
      incomeTax,
      expenseRent,
      expenseFood,
      expenseTransport,
      expenseElectricity,
      expenseInternet,
      expenseInsurance,
      expenseOther
    } = req.body;

    const updateData = {};
    if (monthlyIncome !== undefined) updateData.monthlyIncome = Number(monthlyIncome);
    if (monthlyExpenses !== undefined) updateData.monthlyExpenses = Number(monthlyExpenses);
    if (grossSalary !== undefined) updateData.grossSalary = Number(grossSalary);
    if (pfPercentage !== undefined) updateData.pfPercentage = Number(pfPercentage);
    if (professionalTax !== undefined) updateData.professionalTax = Number(professionalTax);
    if (incomeTax !== undefined) updateData.incomeTax = Number(incomeTax);
    if (expenseRent !== undefined) updateData.expenseRent = Number(expenseRent);
    if (expenseFood !== undefined) updateData.expenseFood = Number(expenseFood);
    if (expenseTransport !== undefined) updateData.expenseTransport = Number(expenseTransport);
    if (expenseElectricity !== undefined) updateData.expenseElectricity = Number(expenseElectricity);
    if (expenseInternet !== undefined) updateData.expenseInternet = Number(expenseInternet);
    if (expenseInsurance !== undefined) updateData.expenseInsurance = Number(expenseInsurance);
    if (expenseOther !== undefined) updateData.expenseOther = Number(expenseOther);

    // Dynamic calculations if salary components are updated
    const finalGross = grossSalary !== undefined ? Number(grossSalary) : 0;
    if (finalGross > 0) {
      const finalPfPct = pfPercentage !== undefined ? Number(pfPercentage) : 12;
      const finalPt = professionalTax !== undefined ? Number(professionalTax) : 0;
      const finalIt = incomeTax !== undefined ? Number(incomeTax) : 0;
      const pfAmt = finalGross * (finalPfPct / 100);
      updateData.monthlyIncome = Math.max(0, finalGross - pfAmt - finalPt - finalIt);
    }

    const rentVal = expenseRent !== undefined ? Number(expenseRent) : 0;
    const foodVal = expenseFood !== undefined ? Number(expenseFood) : 0;
    const transportVal = expenseTransport !== undefined ? Number(expenseTransport) : 0;
    const electricityVal = expenseElectricity !== undefined ? Number(expenseElectricity) : 0;
    const internetVal = expenseInternet !== undefined ? Number(expenseInternet) : 0;
    const insuranceVal = expenseInsurance !== undefined ? Number(expenseInsurance) : 0;
    const otherVal = expenseOther !== undefined ? Number(expenseOther) : 0;
    const totalExp = rentVal + foodVal + transportVal + electricityVal + internetVal + insuranceVal + otherVal;
    if (totalExp > 0 || expenseRent !== undefined) {
      updateData.monthlyExpenses = totalExp;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    return res.json({ success: true, data: user });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// PUT /api/dashboard/simulation
exports.updateSimulation = async (req, res) => {
  try {
    return res.json({ success: true, message: 'Simulation updated' });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
