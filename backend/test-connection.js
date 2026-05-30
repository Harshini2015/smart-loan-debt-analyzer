const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI || "mongodb+srv://harsh22:harsh1322@cluster0.okbifga.mongodb.net/loandb?retryWrites=true&w=majority&appName=Cluster0";
console.log('Testing connection to:', uri);

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('SUCCESS: Connected to MongoDB successfully!');
  process.exit(0);
})
.catch((err) => {
  console.error('FAILED: Connection error:', err.message);
  process.exit(1);
});
