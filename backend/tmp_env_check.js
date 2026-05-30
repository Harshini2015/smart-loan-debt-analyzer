require('dotenv').config();
console.log('XAI_API_KEY=', process.env.XAI_API_KEY ? '[SET]' : '[EMPTY]');
console.log('GROQ_API_KEY=', process.env.GROQ_API_KEY ? '[SET]' : '[EMPTY]');
console.log('Current cwd=', process.cwd());
