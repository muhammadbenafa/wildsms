const express = require('express');
const router = express.Router();
const { broadcast, sendSMS } = require('./smsService');
const store = require('../data/store');
const { facts, stories } = require('../data/content');

let broadcastFactIndex = 0;

// POST /broadcast/fact — manually trigger a fact broadcast (or called by cron)
router.post('/fact', async (req, res) => {
  const phones = store.getActiveSubscribers();
  if (!phones.length) return res.json({ success: false, message: 'No active subscribers' });

  const message = facts[broadcastFactIndex % facts.length];
  broadcastFactIndex++;

  const results = await broadcast(phones, message);
  phones.forEach(p => store.logMessage({ direction: 'outbound', phone: p, message, keyword: 'BROADCAST_FACT' }));

  res.json({ success: true, sent: phones.length, message });
});

// POST /broadcast/story — broadcast the start of a new story
router.post('/story', async (req, res) => {
  const { storyId = 0 } = req.body;
  const phones = store.getActiveSubscribers();
  if (!phones.length) return res.json({ success: false, message: 'No active subscribers' });

  const story = stories[storyId % stories.length];
  const message = story.parts[0];

  phones.forEach(p => store.setStoryProgress(p, story.id, 1));
  const results = await broadcast(phones, message);
  phones.forEach(p => store.logMessage({ direction: 'outbound', phone: p, message, keyword: 'BROADCAST_STORY' }));

  res.json({ success: true, sent: phones.length, story: story.species, message });
});

// POST /broadcast/custom — send a custom message
router.post('/custom', async (req, res) => {
  const { message, phone } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  if (phone) {
    // Send to single number (test)
    const result = await sendSMS(phone, message);
    store.logMessage({ direction: 'outbound', phone, message, keyword: 'MANUAL' });
    return res.json({ success: result.success, sent: 1, error: result.error });
  }

  const phones = store.getActiveSubscribers();
  if (!phones.length) return res.json({ success: false, message: 'No active subscribers' });

  const results = await broadcast(phones, message);
  phones.forEach(p => store.logMessage({ direction: 'outbound', phone: p, message, keyword: 'BROADCAST_CUSTOM' }));
  res.json({ success: true, sent: phones.length });
});

// GET /broadcast/stats
router.get('/stats', (req, res) => {
  res.json(store.getStats());
});

module.exports = router;
