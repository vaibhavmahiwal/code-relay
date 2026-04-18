# 🛡️ RAKSHAK: Real-Time Emergency Management System

Built for **Catalysis 4.0** | **Genesis Club** | **Coding Relay Challenge**

Rakshak is a two-sided emergency response platform designed to bridge the gap between citizens in distress and emergency responders. By utilizing real-time data sync, AI-driven triage, and automated location pinning, Rakshak ensures that every second counts.

## 🚀 Key Features

### 👤 Citizen-Facing Side
- **One-Tap Reporting:** Rapidly file reports for Fire, Medical, or Accident emergencies.
- **AI-Powered Assistant:** An integrated AI assistant helps users describe high-stress situations clearly.
- **Smart Triage:** Automated AI analysis of incident descriptions to suggest urgency levels (1-5).
- **Auto-Location:** Uses Browser Geolocation API to pin the exact coordinates of the distress signal.

### 🖥️ Responder Command Center
- **Real-Time Feed:** New incidents appear instantly on the dashboard via **Socket.io** (No refresh required).
- **Live Triage & Dispatch:** Responders can triage incoming reports and update statuses (`Pending` -> `Assigned` -> `Resolved`).
- **Visual Urgency:** High-severity incidents are visually highlighted for immediate attention.

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Real-time:** Socket.io
- **AI Integration:** Groq SDK (Llama 3 / Mixtral)

---

## 🏗️ Project Structure
```text
rakshak/
├── client/              # React Frontend (Vite)
│   ├── src/components/  # CitizenForm, ResponderDashboard, AITriage
│   └── ...
└── server/              # Node.js Backend
    ├── models/          # Incident.js, User.js
    ├── routes/          # incidents.js, auth.js, ai.js
    └── index.js         # Entry point & Socket.io setup
