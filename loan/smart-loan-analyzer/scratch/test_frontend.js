const http = require('http');

http.get('http://localhost:5173/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('HEADERS:', res.headers);
    console.log('BODY PREVIEW:', data.slice(0, 1000));
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
