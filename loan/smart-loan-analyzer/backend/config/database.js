const dns = require('dns');
const mongoose = require('mongoose');

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/smart-loan-analyzer';

function getMongoUri() {
  return process.env.MONGO_URI || DEFAULT_LOCAL_URI;
}

function isConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * Windows / some networks block SRV lookups for Node's default DNS resolver.
 * Atlas SRV (mongodb+srv://...) needs SRV records — use public DNS or MONGO_URI_STANDARD.
 */
function configureDnsForAtlas(uri) {
  if (!uri || !uri.startsWith('mongodb+srv://')) {
    return;
  }

  const servers = process.env.MONGO_DNS_SERVERS;
  if (servers === 'default' || servers === 'system') {
    console.log('[MongoDB] Using system DNS for Atlas SRV');
    return;
  }

  const list = servers
    ? servers.split(',').map((s) => s.trim()).filter(Boolean)
    : ['8.8.8.8', '1.1.1.1'];

  dns.setServers(list);
  console.log('[MongoDB] DNS servers for Atlas SRV:', list.join(', '));
}

async function tryConnect(uri) {
  const masked = uri.replace(/:([^:@]+)@/, ':****@');
  console.log('[MongoDB] Connecting to:', masked);

  configureDnsForAtlas(uri);

  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
  });

  console.log('[MongoDB] Connected successfully:', mongoose.connection.host);
  return mongoose.connection;
}

async function connectMongo() {
  mongoose.set('strictQuery', false);
  mongoose.set('bufferCommands', false);

  mongoose.connection.on('connected', () => {
    console.log('[MongoDB] Connection open:', mongoose.connection.host);
  });

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected');
  });

  const primaryUri = getMongoUri();
  const standardUri = process.env.MONGO_URI_STANDARD;
  const fallbackUri = process.env.MONGO_URI_FALLBACK;
  const isProduction = process.env.NODE_ENV === 'production';

  const attempts = [
    { label: 'MONGO_URI', uri: primaryUri },
    ...(standardUri ? [{ label: 'MONGO_URI_STANDARD', uri: standardUri }] : []),
  ];

  let lastError;

  for (const { label, uri } of attempts) {
    if (!uri) continue;
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      return await tryConnect(uri);
    } catch (err) {
      lastError = err;
      console.error(`[MongoDB] ${label} failed:`, err.message);
    }
  }

  if (fallbackUri && !isProduction) {
    console.warn('[MongoDB] Trying MONGO_URI_FALLBACK (development only)...');
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      return await tryConnect(fallbackUri);
    } catch (fallbackErr) {
      console.error('[MongoDB] Fallback failed:', fallbackErr.message);
    }
  }

  throw lastError || new Error('Could not connect to MongoDB');
}

module.exports = { connectMongo, isConnected, getMongoUri, DEFAULT_LOCAL_URI };
