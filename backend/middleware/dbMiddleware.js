const { isConnected } = require('../config/database');

const DB_UNAVAILABLE_MESSAGE =
  'Database is not available. Ensure MongoDB is running and MONGO_URI in backend/.env is correct.';

function requireDb(req, res, next) {
  if (isConnected()) {
    return next();
  }
  return res.status(503).json({
    success: false,
    message: DB_UNAVAILABLE_MESSAGE,
  });
}

module.exports = { requireDb, DB_UNAVAILABLE_MESSAGE };
