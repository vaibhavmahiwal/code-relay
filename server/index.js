import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import incidentRoutes from './routes/incidents.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST', 'PATCH'] }
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/incidents', incidentRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('DB error:', err));