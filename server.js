import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DEPLOY_TARGET = process.env.DEPLOY_TARGET || 'local';
const ASSET_BASE = DEPLOY_TARGET === 'gh-pages' ? '/zavilla' : '';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

const serveApp = (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
};

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'ZAVILLA backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/properties', (_req, res) => {
  res.json({
    properties: [
      {
        id: 'prop-1',
        title: 'The Azure Horizon Coastal Villa',
        city: 'Malibu',
        state: 'CA',
        price: 18500,
        listingType: 'rent',
      },
      {
        id: 'prop-2',
        title: 'Solarium Sky Penthouse',
        city: 'Miami',
        state: 'FL',
        price: 3850000,
        listingType: 'sale',
      },
    ],
  });
});

app.get('/api/exchange-rates', async (_req, res) => {
  const apiKey = process.env.EXCHANGERATE_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: 'ExchangeRate API is not configured. Set EXCHANGERATE_API_KEY on the server.',
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
      signal: controller.signal,
    });
    const data = await response.json();

    if (!response.ok || data.result !== 'success') {
      return res.status(502).json({ error: 'ExchangeRate API request failed.' });
    }

    return res.json({
      base: 'USD',
      rates: {
        '$': 1,
        '€': data.conversion_rates.EUR,
        '£': data.conversion_rates.GBP,
      },
      updatedAt: data.time_last_update_utc,
    });
  } catch {
    return res.status(502).json({ error: 'Unable to reach ExchangeRate API.' });
  } finally {
    clearTimeout(timeout);
  }
});

if (ASSET_BASE) {
  app.use(`${ASSET_BASE}/`, express.static(distDir));
  app.get(`${ASSET_BASE}/`, serveApp);
  app.get(`${ASSET_BASE}/*`, serveApp);
} else {
  app.use(express.static(distDir));
  app.get('*', serveApp);
}

app.listen(PORT, () => {
  console.log(`ZAVILLA backend running on http://localhost:${PORT}${ASSET_BASE || ''}`);
});
