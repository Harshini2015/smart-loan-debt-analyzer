const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GROQ_CONFIG_LOG } = require('./services/groqService');
console.log('GROQ_CONFIG_LOG():', GROQ_CONFIG_LOG());
