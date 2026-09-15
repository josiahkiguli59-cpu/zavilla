import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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
