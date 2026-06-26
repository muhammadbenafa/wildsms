const express = require('express');
const router = express.Router();
const { sendSMS } = require('./smsService');
const store = require('../data/store');
const { stories, facts, welcomeMsg, reportPrompt, stopMsg, unknownMsg } = require('../data/content');

let factIndex = 0;

// POST /sms/inbound — Africa's Talking calls this on every incoming SMS
router.post('/inbound', async (req, res) => {
  // AT sends: from, to, text, date, id, linkId
  const from = (req.body.from || '').trim();
  const rawText = (req.body.text || '').trim();
  const text = rawText.toUpperCase();
  const words = text.split(/\s+/);
  const keyword = words[0];

  console.log(`[WildSMS] Inbound from ${from}: "${rawText}"`);
  store.logMessage({ direction: 'inbound', phone: from, message: rawText, keyword });

  let reply = '';

  if (keyword === 'JOIN') {
    const isNew = store.subscribe(from);
    reply = isNew
      ? welcomeMsg(from)
      : `Welcome back to WildSMS! Reply FACT, STORY, or REPORT. Nigeria's wildlife needs you.`;

  } else if (keyword === 'FACT') {
    store.subscribe(from);
    reply = facts[factIndex % facts.length];
    factIndex++;

  } else if (keyword === 'STORY') {
    store.subscribe(from);
    const story = stories[0];
    store.setStoryProgress(from, story.id, 1);
    reply = story.parts[0];

  } else if (keyword === 'MORE') {
    const prog = store.getStoryProgress(from);
    const story = stories.find(s => s.id === prog.storyId);
    if (story && prog.part < story.parts.length) {
      reply = story.parts[prog.part];
      store.setStoryProgress(from, story.storyId, prog.part + 1);
    } else {
      // start next story
      const nextStory = stories[(prog.storyId % stories.length)];
      store.setStoryProgress(from, nextStory.id, 1);
      reply = nextStory.parts[0];
    }

  } else if (keyword === 'REPORT') {
    store.subscribe(from);
    const subKeyword = words[1];
    if (!subKeyword) {
      reply = reportPrompt;
    } else {
      const typeMap = {
        POACH: 'Illegal Poaching',
        FIRE: 'Forest Fire',
        TRAP: 'Snare/Trap Found',
        TRADE: 'Illegal Wildlife Trade',
        ELEPHANT: 'Elephant Conflict',
        PANGOLIN: 'Pangolin Sighting'
      };
      const reportType = typeMap[subKeyword] || `Other: ${subKeyword}`;
      const details = words.slice(2).join(' ') || rawText;
      store.addReport({ phone: from, type: reportType, details, timestamp: new Date().toISOString() });
      reply = `WildSMS: Report received — "${reportType}". Thank you for protecting Nigeria's wildlife. Rangers have been notified. Your identity stays private.`;
    }

  } else if (keyword === 'STOP' || keyword === 'UNSUBSCRIBE') {
    store.unsubscribe(from);
    reply = stopMsg;

  } else if (keyword === 'HELP' || keyword === 'INFO') {
    reply = `WildSMS Help:\nFACT — wildlife fact\nSTORY — hear a story\nMORE — continue a story\nREPORT — flag a threat\nSTOP — unsubscribe\n\nShortcode: 35367`;

  } else {
    // Auto-subscribe anyone who texts in, even unknown keywords
    store.subscribe(from);
    reply = unknownMsg;
  }

  // Send the reply
  if (reply) {
    const result = await sendSMS(from, reply);
    store.logMessage({ direction: 'outbound', phone: from, message: reply, keyword });
    if (!result.success) {
      console.error('[WildSMS] Failed to reply:', result.error);
    }
  }

  res.sendStatus(200);
});

// POST /sms/delivery — AT delivery reports (optional)
router.post('/delivery', (req, res) => {
  console.log('[WildSMS] Delivery report:', req.body);
  res.sendStatus(200);
});

module.exports = router;
