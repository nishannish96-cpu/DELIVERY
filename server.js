const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
// Render assigns a dynamic port via process.env.PORT (defaults to 10000 on Render, 3000 locally)
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend assets from public directory and project root
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Health check endpoint required by Render for zero-downtime deployment monitoring
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'KudlaDirect Platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Sample In-Memory Database for Mangalore Wholesale Hubs
const DISTRIBUTORS = [
  { id: 'DIST-BND-01', name: 'Canara Cashew Exporters', hub: 'Bunder', location: 'Goods Shed Road', category: 'Cashews & Dry Fruits' },
  { id: 'DIST-BND-02', name: 'Coastline Spice Mills', hub: 'Bunder', location: 'Azizuddin Road', category: 'Spices & Masalas' },
  { id: 'DIST-BKP-01', name: 'Baikampady Agro Industries', hub: 'Baikampady', location: 'Industrial Area Zone 2', category: 'Oils & Ghee' },
  { id: 'DIST-DCK-01', name: 'Old Port Fish Landing Association', hub: 'Bunder Docks', location: 'Bunder Wharf', category: 'Fresh Coastal Seafood' },
  { id: 'DIST-MND-01', name: 'Central Market Mandi Merchants', hub: 'Central Market', location: 'Hampankatta', category: 'Produce & Traditional Sweets' }
];

let orders = [
  {
    orderId: 'KUD-9481',
    customer: 'Rohith Shetty',
    phone: '9845012345',
    area: 'Kadri',
    address: 'Flat 402, Inland Winds, Kadri Kambla Rd',
    items: [
      { id: 1, name: 'Mangalore Jumbo Cashews (W-240)', qty: 2, wholesalePrice: 375 },
      { id: 3, name: 'Boiled Red Rice (Kaje Rice - Matta)', qty: 1, wholesalePrice: 245 }
    ],
    slot: 'Morning Milk-Run (7 AM - 10 AM)',
    status: 'Batch Locked for Bunder 5:30 AM Pick',
    total: 995,
    createdAt: new Date().toISOString()
  }
];

// GET: All active distributors & hub metadata
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    city: 'Mangaluru',
    hubs: DISTRIBUTORS,
    totalHubs: DISTRIBUTORS.length,
    activeBatchCutoff: '9:00 PM IST',
    morningPickupTime: '5:30 AM IST'
  });
});

// GET: Retrieve all active batch orders
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    count: orders.length,
    orders: orders
  });
});

// POST: Place a batched morning order
app.post('/api/orders', (req, res) => {
  const { customer, phone, items, slot, area, address, payment, total } = req.body;
  const orderId = 'KUD-' + Math.floor(1000 + Math.random() * 9000);
  const newOrder = {
    orderId,
    customer: customer || 'Mangalore Resident',
    phone: phone || '',
    items: items || [],
    slot: slot || 'Morning Milk-Run (7 AM - 10 AM)',
    area: area || 'Bejai',
    address: address || 'Mangaluru',
    payment: payment || 'UPI',
    total: total || 0,
    status: 'Batch Locked for Bunder 5:30 AM Pick',
    createdAt: new Date().toISOString()
  };
  orders.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

// GET: Morning Dispatch Manifest for electric scooter riders
app.get('/api/dispatch/morning-manifest', (req, res) => {
  res.json({
    date: new Date().toLocaleDateString('en-IN'),
    route: 'Corridor 1 (Bunder - Kodialbail - Mannagudda - Urwa - Bejai - Kadri)',
    fleetType: 'Electric Two-Wheeler Cargo (Ather 450X Commercial)',
    totalStops: orders.length,
    pickupHub: 'Bunder Wholesale Terminal',
    status: 'Active Morning Run',
    stops: orders.map((o, idx) => ({
      stopNumber: idx + 1,
      orderId: o.orderId,
      customer: o.customer,
      address: o.address,
      area: o.area,
      status: idx === 0 ? 'Out for delivery' : 'Queued'
    }))
  });
});

// Fallback route: serve index.html for root and SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start listening on Render's specified port (0.0.0.0 binding)
app.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================');
  console.log(`🚀 KudlaDirect Server running on Render!`);
  console.log(`📡 URL: http://0.0.0.0:${PORT}`);
  console.log(`🏥 Health Check: http://0.0.0.0:${PORT}/healthz`);
  console.log(`📦 Bunder Batch Cutoff: 9:00 PM IST`);
  console.log('====================================================');
});
