# 🩸 LifeDrop — Blood Donation Platform

A full-stack blood donation website with a beautiful frontend and a Node.js REST API backend.

---

## 📁 Project Structure

```
blood-donation/
├── frontend/
│   └── index.html          ← Open this in your browser
└── backend/
    ├── server.js            ← Express API server
    ├── package.json
    └── data/
        └── db.json          ← Auto-created JSON database
```

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

API runs at: **http://localhost:3001**

> For auto-reload during development:
> ```bash
> npm run dev
> ```

### 2. Open the Frontend

Simply open `frontend/index.html` in your browser.

> **Note:** If the backend is offline, the site still works using built-in demo data.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/donors` | List all donors |
| GET | `/api/donors?bloodGroup=O+&city=Chennai` | Filter donors |
| POST | `/api/donors` | Register new donor |
| PATCH | `/api/donors/:id/availability` | Toggle availability |
| GET | `/api/requests` | List blood requests |
| POST | `/api/requests` | Post new blood request |
| PATCH | `/api/requests/:id/fulfill` | Mark request fulfilled |
| POST | `/api/donations` | Record a donation |

---

## 📦 POST Body Examples

### Register Donor
```json
{
  "name": "Arjun Mehta",
  "bloodGroup": "O+",
  "city": "Chennai",
  "phone": "9876543210"
}
```

### Post Blood Request
```json
{
  "patientName": "Kiran Das",
  "bloodGroup": "O+",
  "hospital": "Apollo Hospital",
  "city": "Chennai",
  "unitsNeeded": 2,
  "urgency": "critical",
  "contactPhone": "9988776655"
}
```

---

## ✨ Features

- 🩸 Donor registration with blood group & city
- 🏥 Blood request posting with urgency levels
- 🔍 Filter donors by blood group and city
- 📊 Live stats dashboard (animated counters)
- 🗂 Blood group overview grid
- ✅ Mark requests as fulfilled
- 💾 JSON file-based database (no setup needed)
- 📱 Fully responsive design
- 🎨 Works offline with demo data

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend | Node.js, Express |
| Database | JSON file (data/db.json) |
| Fonts | Playfair Display + DM Sans |
