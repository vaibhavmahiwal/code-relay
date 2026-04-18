import express from 'express';
import Groq from 'groq-sdk';
import Incident from '../models/Incident.js';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 1. Auto-triage: analyze a new incident and suggest severity + response
router.post('/triage', async (req, res) => {
  const { type, description, severity } = req.body;
  try {
    const chat = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
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
- Description: "${description || 'No description provided'}"

Return ONLY the JSON. No explanation, no markdown.`
      }],
      max_tokens: 300,
      temperature: 0.3
    });

    const raw = chat.choices[0].message.content.trim();
    const json = JSON.parse(raw);
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: 'AI triage failed', detail: err.message });
  }
});

// 2. Incident summary: summarize all active incidents for command briefing
router.get('/summary', async (req, res) => {
  try {
    const incidents = await Incident.find({ status: { $ne: 'resolved' } })
      .sort({ severity: -1 })
      .limit(20);

    if (incidents.length === 0) {
      return res.json({ summary: 'No active incidents at this time. All clear.' });
    }

    const incidentList = incidents.map((i, idx) =>
      `${idx + 1}. ${i.type.toUpperCase()} | Severity ${i.severity}/5 | Status: ${i.status} | ${i.description || 'No description'}`
    ).join('\n');

    const chat = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{
        role: 'user',
        content: `You are an emergency command center AI. Give a concise operational briefing (max 4 sentences) for the following active incidents. Focus on priority order, resource needs, and any patterns.

Active Incidents:
${incidentList}

Write a plain text briefing for the duty commander. No bullet points, no markdown.`
      }],
      max_tokens: 200,
      temperature: 0.4
    });

    res.json({ summary: chat.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Summary failed', detail: err.message });
  }
});

// 3. Citizen assistant: help citizen describe their emergency
router.post('/assist', async (req, res) => {
  const { message, incidentType } = req.body;
  try {
    const chat = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{
        role: 'system',
        content: `You are a calm emergency response assistant helping a citizen report a ${incidentType || 'emergency'} incident. Ask focused questions to gather: exact location details, number of people affected, immediate dangers present. Keep responses under 2 sentences. Be calm, direct, reassuring.`
      }, {
        role: 'user',
        content: message
      }],
      max_tokens: 120,
      temperature: 0.5
    });

    res.json({ reply: chat.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Assistant failed', detail: err.message });
  }
});

export default router;