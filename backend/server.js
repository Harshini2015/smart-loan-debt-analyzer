require('dotenv').config();
const { GROQ_CONFIG_LOG } = require('./services/groqService');
const { connectMongo, getMongoUri } = require('./config/database');
const { requireDb } = require('./middleware/dbMiddleware');

console.log('[Startup] Groq configuration:', GROQ_CONFIG_LOG());

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'https://smart-loan-debt-analyzer.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  })
);
app.use(express.json());
app.options('*', cors());

const TransactionHistory = require('./models/TransactionHistory');
const EmergencyWallet = require('./models/EmergencyWallet');
const FamilyGroup = require('./models/FamilyGroup');
const GoalTimeline = require('./models/GoalTimeline');

const createFeatureIndexes = async () => {
  try {
    await Promise.all([
      TransactionHistory.createIndexes(),
      EmergencyWallet.createIndexes(),
      FamilyGroup.createIndexes(),
      GoalTimeline.createIndexes(),
    ]);
    console.log('[MongoDB] Feature indexes ready');
  } catch (err) {
    if (
      err.message.includes('existing index has the same name') ||
      err.codeName === 'IndexOptionsConflict' ||
      err.codeName === 'IndexKeySpecsConflict'
    ) {
      console.warn('[MongoDB] Index conflict ignored:', err.message);
      return;
    }
    throw err;
  }
};

// Routes that need MongoDB
const dbRouter = express.Router();
dbRouter.use(requireDb);

dbRouter.use('/auth', require('./routes/authRoutes'));
dbRouter.use('/finance', require('./routes/financeRoutes'));
dbRouter.use('/loan/simulate', require('./routes/loanSimRoutes'));
dbRouter.use('/loan', require('./routes/loanRoutes'));
dbRouter.use('/assistant', require('./routes/assistantRoutes'));
dbRouter.use('/dashboard', require('./routes/dashboardRoutes'));
dbRouter.use('/stress', require('./routes/stressRoutes'));
dbRouter.use('/suggestions', require('./routes/suggestionsRoutes'));
dbRouter.use('/onboarding', require('./routes/onboardingRoutes'));
dbRouter.use('/v2/fund', require('./routes/emergencyFund'));
dbRouter.use('/v2/family', require('./routes/family'));
dbRouter.use('/v2/goals', require('./routes/goals'));
dbRouter.use('/fund', require('./routes/v1EmergencyFund'));
dbRouter.use('/family', require('./routes/v1Family'));
dbRouter.use('/goals', require('./routes/v1Goals'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Loan & Debt Stress Analyzer Backend API',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// AI chat does not require MongoDB
app.use('/api/ai', require('./routes/aiRoutes'));

app.use('/api', dbRouter);

require('./jobs/emergencyFund');

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const message =
    err.message && err.message.includes('buffering timed out')
      ? 'Database connection timed out. Start MongoDB locally or fix MONGO_URI in backend/.env.'
      : err.message || 'Internal server error';
  res.status(err.status || 500).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectMongo();
    await createFeatureIndexes();
  } catch (err) {
    console.error('[Startup] MongoDB failed:', err.message);
    console.error(
      '[Startup] Tip: use local MongoDB — set MONGO_URI=mongodb://127.0.0.1:27017/smart-loan-analyzer in backend/.env'
    );
    console.error('[Startup] Current MONGO_URI:', getMongoUri().replace(/:([^:@]+)@/, ':****@'));
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
