const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // ── Onboarding ──────────────────────────────────────────────
    onboardingCompleted: { type: Boolean, default: false },

    // ── Financial Profile ────────────────────────────────────────
    monthlyIncome: { type: Number, default: 0, min: 0 },
    monthlyExpenses: { type: Number, default: 0, min: 0 },
    savings: { type: Number, default: 0, min: 0 },
    emergencyFundAmount: { type: Number, default: 0, min: 0 },
    occupation: { type: String, default: '' },

    // ── Salary Module ─────────────────────────────────────────────
    grossSalary: { type: Number, default: 0, min: 0 },
    pfPercentage: { type: Number, default: 12, min: 0 },
    professionalTax: { type: Number, default: 0, min: 0 },
    incomeTax: { type: Number, default: 0, min: 0 },

    // ── Expense Tracking ──────────────────────────────────────────
    expenseRent: { type: Number, default: 0, min: 0 },
    expenseFood: { type: Number, default: 0, min: 0 },
    expenseTransport: { type: Number, default: 0, min: 0 },
    expenseElectricity: { type: Number, default: 0, min: 0 },
    expenseInternet: { type: Number, default: 0, min: 0 },
    expenseInsurance: { type: Number, default: 0, min: 0 },
    expenseOther: { type: Number, default: 0, min: 0 },

    // ── Computed / Cached ─────────────────────────────────────────
    totalEMI: { type: Number, default: 0, min: 0 },
    debtHealthScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
