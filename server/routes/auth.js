import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'Username already taken' });
    const user = await User.create({ username, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.password !== password) return res.status(401).json({ error: 'Wrong password' });
    user.lastLogin = Date.now();
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;