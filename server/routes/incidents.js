import express from 'express';
import Incident from '../models/Incident.js';
import { io } from '../index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ severity: -1, createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const incident = await Incident.create(req.body);
    io.emit('new_incident', incident);
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo },
      { new: true }
    );
    io.emit('incident_updated', incident);
    res.json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
