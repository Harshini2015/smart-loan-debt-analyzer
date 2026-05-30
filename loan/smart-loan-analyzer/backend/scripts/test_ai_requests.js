const fetch = globalThis.fetch || require('node-fetch');
const url = 'http://localhost:5000/api/ai/chat';
const msgs = [
  'What is EMI?',
  'Tell me a joke',
  'What is Java?',
  'How does compound interest work?',
  'Can I get a home loan?'
];

(async () => {
  for (const m of msgs) {
    try {
      console.log('\n--- ' + m + ' ---');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: m })
      });
      const text = await res.text();
      console.log(text);
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
})();
