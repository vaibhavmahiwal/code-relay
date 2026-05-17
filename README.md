# 🛡️ RAKSHAK: Real-Time Emergency Management System

Built for **Catalysis 4.0** | **Genesis Club** | **Coding Relay Challenge**

> *Every second counts. Rakshak makes sure none are wasted.*

Rakshak is a two-sided emergency response platform designed to bridge the gap between citizens in distress and emergency responders. By utilizing real-time data sync, AI-driven triage, and automated location pinning, Rakshak ensures that every second counts.

---

## 🚀 Key Features

### 👤 Citizen-Facing Side
- **One-Tap Reporting:** Rapidly file reports for Fire, Medical, or Accident emergencies.
- **AI-Powered Assistant:** An integrated AI chat assistant helps users describe high-stress situations clearly through guided questions — no blank box panic.
- **Smart Triage:** Automated AI analysis of incident descriptions to suggest urgency levels (1–5), catching mismatches between what a citizen rates and what their description implies.
- **Auto-Location:** Uses Browser Geolocation API to pin the exact coordinates of the distress signal. No manual address entry required.

### 🖥️ Responder Command Center
- **Real-Time Feed:** New incidents appear instantly on the dashboard via **Socket.IO** — no refresh required, no polling delay.
- **Live Triage & Dispatch:** Responders can triage incoming reports and update statuses (`Pending` → `Assigned` → `Resolved`) with one click. Citizens see the status change live on their end.
- **Visual Urgency:** High-severity incidents are visually highlighted and trigger an audio alert on the responder dashboard the moment they arrive.
- **AI Command Briefing:** One-click AI-generated operational summary of all active incidents — written for a duty officer, useful for shift handovers.
- **Live Map View:** Leaflet-powered map shows all active incidents as color-coded pins — red for critical, amber for moderate, green for low. Click any pin for details.
- **Auto-Escalation:** Severity 4–5 incidents left unattended for over 60 seconds are automatically flagged with a flashing `UNATTENDED` badge.

### 📋 Live Incident Feed (Public)
- **Live Wall:** Public-facing feed of all reported incidents, updating in real time via Socket.IO.
- **Filter & Search:** Filter by status (Pending / Assigned / Resolved) and by incident type. Full-text search across descriptions.
- **Incident Timeline:** Each card expands to show a 3-step timeline — Reported → Assigned → Resolved — with timestamps at each stage.
- **Live Stats:** Running counters for total, pending, responding, and resolved incidents at the top of the feed.

### 🤖 AI Features (Powered by Groq + Llama 3)
- **AI Triage Engine:** Analyzes incident type, description, and self-reported severity. Returns a corrected severity, recommended response unit (Ambulance / Fire Brigade / Police / Disaster Response), estimated unit count, a one-line priority action, and flagged risk factors.
- **Citizen AI Assistant:** Conversational chat on the report form. Asks focused follow-up questions to extract better incident details from a panicking citizen. Fills the description box automatically from the conversation.
- **AI Command Briefing:** Fetches all active incidents from MongoDB and generates a concise 3–4 sentence plain-English briefing for the duty commander — priority order, resource gaps, and patterns all in one read.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite |
| Styling | Inline React styles (dark theme, mobile-aware) |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose) |
| Real-Time | Socket.IO |
| Maps | Leaflet.js + React-Leaflet |
| AI / LLM | Groq SDK — Llama 3 8B (llama3-8b-8192) |
| HTTP Client | Axios |

---

## 🏗️ Project Structure

```text
rakshak/
├── client/                        # React Frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── AIBriefing.jsx     # AI command briefing panel for responders
│       │   ├── AITriage.jsx       # AI severity analysis shown on citizen form
│       │   ├── AuthModal.jsx      # Login / Signup modal for responders
│       │   ├── CitizenAssistant.jsx  # AI chat assistant on citizen form
│       │   ├── CitizenForm.jsx    # Emergency report form (citizen side)
│       │   ├── IncidentFeed.jsx   # Public live incident wall with filters
│       │   ├── MapView.jsx        # Leaflet map with severity-coded pins
│       │   └── ResponderDashboard.jsx  # Command center (responders only)
│       ├── App.jsx                # Root component, routing between views
│       ├── main.jsx               # React entry point
│       └── socket.js              # Socket.IO client singleton
│
└── server/                        # Node.js Backend
    ├── models/
    │   ├── Incident.js            # Mongoose schema: type, severity, location, status
    │   └── User.js                # Mongoose schema: username, password, role
    ├── routes/
    │   ├── ai.js                  # /triage, /summary, /assist — Groq API endpoints
    │   ├── auth.js                # /login, /signup — operator authentication
    │   └── incidents.js           # GET, POST, PATCH /api/incidents
    └── index.js                   # Express setup, Socket.IO init, MongoDB connect
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas connection string
- A free Groq API key from [console.groq.com](https://console.groq.com)

### 1. Clone and install

```bash
git clone https://github.com/yourteam/rakshak.git
cd rakshak

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Environment setup

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rakshak
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run the app

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open `http://localhost:5173`

---

## 🔑 Test Credentials

Use these to create responder accounts via the **Sign Up** tab in the auth modal:

| Username | Password | Role |
|---|---|---|
| Alpha_01 | rescue123 | operator |
| Beta_02 | dispatch99 | operator |
| Omega_03 | triage007 | operator |

> Citizen reporting requires no login — open **Report Emergency** and submit directly.

---

## 🔁 How It Works
