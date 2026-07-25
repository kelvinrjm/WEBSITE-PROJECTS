const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(bodyParser.json());

// ── helpers ──────────────────────────────────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB_FILE)) return { donors: [], requests: [], donations: [] };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── seed data ─────────────────────────────────────────────────────────────────
if (!fs.existsSync(DB_FILE)) {
  writeDB({
    donors: [
      { id: uid(), name: 'Arjun Mehta',    bloodGroup: 'O+', city: 'Chennai',   phone: '9876543210', available: true,  createdAt: new Date().toISOString() },
      { id: uid(), name: 'Priya Sharma',   bloodGroup: 'A+', city: 'Mumbai',    phone: '9123456789', available: true,  createdAt: new Date().toISOString() },
      { id: uid(), name: 'Ravi Kumar',     bloodGroup: 'B-', city: 'Delhi',     phone: '9012345678', available: false, createdAt: new Date().toISOString() },
      { id: uid(), name: 'Meena Iyer',     bloodGroup: 'AB+',city: 'Bangalore', phone: '8901234567', available: true,  createdAt: new Date().toISOString() },
      { id: uid(), name: 'Sunita Patel',   bloodGroup: 'O-', city: 'Ahmedabad', phone: '8012345678', available: true,  createdAt: new Date().toISOString() },
    ],
    requests: [
      { id: uid(), patientName: 'Kiran Das',   bloodGroup: 'O+', hospital: 'Apollo Chennai',   city: 'Chennai',   unitsNeeded: 2, urgency: 'critical', status: 'open',   createdAt: new Date().toISOString() },
      { id: uid(), patientName: 'Leela Nair',  bloodGroup: 'A+', hospital: 'Fortis Mumbai',    city: 'Mumbai',    unitsNeeded: 1, urgency: 'moderate', status: 'open',   createdAt: new Date().toISOString() },
      { id: uid(), patientName: 'Amit Singh',  bloodGroup: 'B+', hospital: 'AIIMS Delhi',      city: 'Delhi',     unitsNeeded: 3, urgency: 'critical', status: 'open',   createdAt: new Date().toISOString() },
    ],
    donations: []
  });
}

// ── DONORS ────────────────────────────────────────────────────────────────────
// GET all donors (optional filter ?bloodGroup=O+&city=Chennai)
app.get('/api/donors', (req, res) => {
  let { bloodGroup, city } = req.query;
  let { donors } = readDB();
  if (bloodGroup) donors = donors.filter(d => d.bloodGroup === bloodGroup);
  if (city)       donors = donors.filter(d => d.city.toLowerCase().includes(city.toLowerCase()));
  res.json({ success: true, count: donors.length, donors });
});

// POST register donor
app.post('/api/donors', (req, res) => {
  const { name, bloodGroup, city, phone } = req.body;
  if (!name || !bloodGroup || !city || !phone)
    return res.status(400).json({ success: false, message: 'All fields are required.' });

  const db = readDB();
  const donor = { id: uid(), name, bloodGroup, city, phone, available: true, createdAt: new Date().toISOString() };
  db.donors.push(donor);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Donor registered successfully!', donor });
});

// PATCH toggle availability
app.patch('/api/donors/:id/availability', (req, res) => {
  const db = readDB();
  const donor = db.donors.find(d => d.id === req.params.id);
  if (!donor) return res.status(404).json({ success: false, message: 'Donor not found.' });
  donor.available = !donor.available;
  writeDB(db);
  res.json({ success: true, available: donor.available });
});

// ── REQUESTS ──────────────────────────────────────────────────────────────────
// GET all requests
app.get('/api/requests', (req, res) => {
  const { requests } = readDB();
  res.json({ success: true, count: requests.length, requests });
});

// POST new blood request
app.post('/api/requests', (req, res) => {
  const { patientName, bloodGroup, hospital, city, unitsNeeded, urgency, contactPhone } = req.body;
  if (!patientName || !bloodGroup || !hospital || !city || !unitsNeeded)
    return res.status(400).json({ success: false, message: 'Required fields missing.' });

  const db = readDB();
  const request = {
    id: uid(), patientName, bloodGroup, hospital, city,
    unitsNeeded: parseInt(unitsNeeded), urgency: urgency || 'moderate',
    contactPhone: contactPhone || '', status: 'open',
    createdAt: new Date().toISOString()
  };
  db.requests.push(request);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Blood request posted!', request });
});

// PATCH fulfill request
app.patch('/api/requests/:id/fulfill', (req, res) => {
  const db = readDB();
  const req2 = db.requests.find(r => r.id === req.params.id);
  if (!req2) return res.status(404).json({ success: false, message: 'Request not found.' });
  req2.status = 'fulfilled';
  writeDB(db);
  res.json({ success: true, message: 'Request marked as fulfilled.' });
});

// ── DONATIONS ─────────────────────────────────────────────────────────────────
app.post('/api/donations', (req, res) => {
  const { donorId, requestId, units } = req.body;
  const db = readDB();
  const donation = { id: uid(), donorId, requestId, units: parseInt(units) || 1, donatedAt: new Date().toISOString() };
  db.donations.push(donation);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Donation recorded!', donation });
});

// ── STATS ─────────────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const db = readDB();
  const bloodGroupCounts = {};
  db.donors.forEach(d => { bloodGroupCounts[d.bloodGroup] = (bloodGroupCounts[d.bloodGroup] || 0) + 1; });
  res.json({
    success: true,
    stats: {
      totalDonors:     db.donors.length,
      availableDonors: db.donors.filter(d => d.available).length,
      openRequests:    db.requests.filter(r => r.status === 'open').length,
      criticalRequests:db.requests.filter(r => r.status === 'open' && r.urgency === 'critical').length,
      totalDonations:  db.donations.length,
      bloodGroupCounts
    }
  });
});

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🩸  Blood Donation API running at http://localhost:${PORT}`);
  console.log(`   GET  /api/stats`);
  console.log(`   GET  /api/donors?bloodGroup=O+&city=Chennai`);
  console.log(`   POST /api/donors`);
  console.log(`   GET  /api/requests`);
  console.log(`   POST /api/requests`);
  console.log(`   POST /api/donations\n`);
});
