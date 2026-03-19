const express = require('express');
const cors = require('cors');
const app = express();

// Unikalne ID instancji backendu
const INSTANCE_ID = process.env.HOSTNAME || `backend-${Math.random().toString(36).substr(2, 9)}`;

app.use(cors());
app.use(express.json());

// In-memory storage dla produktów
let products = [
  { id: 1, name: 'Laptop', price: 1299.99, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 29.99, category: 'Accessories' },
  { id: 3, name: 'Keyboard', price: 79.99, category: 'Accessories' },
];

let nextId = 4;

// GET /api/items - pobierz wszystkie produkty
app.get('/api/items', (req, res) => {
  console.log(`[${INSTANCE_ID}] GET /api/items`);
  res.json({
    success: true,
    data: products,
    instanceId: INSTANCE_ID,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/items - dodaj nowy produkt
app.post('/api/items', (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      error: 'Name and price are required',
    });
  }

  const newProduct = {
    id: nextId++,
    name,
    price: parseFloat(price),
    category: category || 'Uncategorized',
  };

  products.push(newProduct);

  console.log(`[${INSTANCE_ID}] POST /api/items - Added product:`, newProduct);
  res.status(201).json({
    success: true,
    data: newProduct,
    instanceId: INSTANCE_ID,
  });
});

// GET /api/stats - statystyki (cache 30 sekund w Nginx)
app.get('/api/stats', (req, res) => {
  console.log(`[${INSTANCE_ID}] GET /api/stats`);
  
  res.set('Cache-Control', 'public, max-age=30');
  res.set('X-Cache-Source', 'backend');
  
  res.json({
    success: true,
    stats: {
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + p.price, 0).toFixed(2),
      categories: [...new Set(products.map(p => p.category))].length,
      averagePrice: (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2),
    },
    instanceId: INSTANCE_ID,
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', instanceId: INSTANCE_ID });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📌 Instance ID: ${INSTANCE_ID}`);
});