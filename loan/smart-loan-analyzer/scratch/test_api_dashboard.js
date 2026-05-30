const http = require('http');

function postJSON(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: JSON.parse(body)
        });
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJSON(url, token) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'Password123!';
  const name = 'Test User';

  console.log('1. Registering new user...');
  try {
    const regRes = await postJSON('http://localhost:5000/api/auth/register', { name, email, password });
    console.log('Registration status:', regRes.status);
    console.log('Registration body:', regRes.body);

    const token = regRes.body?.data?.token || regRes.body?.token;
    if (!token) {
      throw new Error('Failed to get token from registration');
    }

    console.log('\n2. Fetching dashboard data with token...');
    const dashRes = await getJSON('http://localhost:5000/api/dashboard', token);
    console.log('Dashboard status:', dashRes.status);
    console.log('Dashboard body:', JSON.stringify(dashRes.body, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  }
}

run();
