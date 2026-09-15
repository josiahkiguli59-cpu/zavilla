import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ZAVILLA backend running on http://localhost:${PORT}`);
});
