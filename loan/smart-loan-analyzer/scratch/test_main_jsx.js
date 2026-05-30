const http = require('http');

http.get('http://localhost:5173/src/main.jsx', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('BODY PREVIEW:', data.slice(0, 1500));
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
