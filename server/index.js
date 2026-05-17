import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js'; 
import incidentRoutes from './routes/incidents.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';



connectDB();

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST', 'PATCH'] }
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/incidents', incidentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

io.on('connection', (socket) => {
  console.log(' Client connected:', socket.id);
});

// 3. Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);