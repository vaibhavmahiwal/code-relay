import express from 'express';
import Groq from 'groq-sdk';
import Incident from '../models/Incident.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 1. Auto-triage: Groq Version
router.post('/triage', async (req, res) => {
  const { type, description, severity } = req.body;
  try {
    const chat = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{
        role: 'user',
        content: `You are an emergency dispatch AI. Analyze this incident and respond ONLY in this exact JSON format:
{
  "suggestedSeverity": <1-5 number>,
  "responseType": "<one of: Police, Fire Brigade, Ambulance, Disaster Response, Multiple Units>",
  "estimatedUnits": <number 1-5>,
  "priorityAction": "<one sentence, max 12 words>",
  "riskFactors": ["<factor1>", "<factor2>", "<factor3>"]
}

Incident:
- Type: ${type}
- Reported Severity: ${severity}/5
- Description: "${description || 'No description provided'}"`
      }],
      max_tokens: 300,
      temperature: 0.2 // Lower temperature for more consistent JSON
    });

    let raw = chat.choices[0].message.content.trim();
    
    // Safety check: Remove markdown backticks if AI includes them
    raw = raw.replace(/```json|```/g, "");
    
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ error: 'Groq triage failed', detail: err.message });
  }
});

// 2. Incident summary: Groq Version
router.get('/summary', async (req, res) => {
  try {
    const incidents = await Incident.find({ status: { $ne: 'resolved' } })
      .sort({ severity: -1 })
      .limit(20);

    if (incidents.length === 0) {
      return res.json({ summary: 'No active incidents at this time. All clear.' });
    }

    const incidentList = incidents.map((i, idx) =>
      `${idx + 1}. ${i.type.toUpperCase()} | Severity ${i.severity}/5 | ${i.description}`
    ).join('\n');

    const chat = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{
        role: 'user',
        content: `You are an emergency command center AI. Give a concise operational briefing (max 4 sentences) for the following incidents:
${incidentList}
Write a plain text briefing for the duty commander.`
      }],
      max_tokens: 200
    });

    res.json({ summary: chat.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Summary failed', detail: err.message });
  }
});

// 3. Citizen assistant: Groq Version
router.post('/assist', async (req, res) => {
  const { message, incidentType } = req.body;
  try {
    const chat = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{
        role: 'system',
        content: `You are a calm emergency response assistant helping a citizen report a ${incidentType}. Ask focused questions about location and injuries. Keep responses under 2 sentences.`
      }, {
        role: 'user',
        content: message
      }],
      max_tokens: 150
    });

    res.json({ reply: chat.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Assistant failed', detail: err.message });
  }
});

export default router;