// Load .env in development; in Docker, env vars are injected directly
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cron = require('node-cron');
const path = require('path');

const smsRoutes = require('./routes/sms');
const broadcastRoutes = require('./routes/broadcast');
const store = require('./data/store');
const { facts } = require('./data/content');
const { broadcast } = require('./routes/smsService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/sms', smsRoutes);
app.use('/broadcast', broadcastRoutes);

// Dashboard API
app.get('/api/stats', (req, res) => res.json(store.getStats()));
app.get('/api/reports', (req, res) => res.json(store.reports.slice(-50).reverse()));
app.get('/api/messages', (req, res) => res.json(store.messageLog.slice(-50).reverse()));

// Dashboard UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── CRON JOBS ────────────────────────────────────────────────────────────────

let dailyFactIndex = 0;

// Daily wildlife fact — every morning at 8:00 AM Nigeria time (WAT = UTC+1)
cron.schedule('0 7 * * *', async () => {
  const phones = store.getActiveSubscribers();
  if (!phones.length) return;
  const msg = facts[dailyFactIndex % facts.length];
  dailyFactIndex++;
  console.log(`[CRON] Daily fact broadcast to ${phones.length} subscribers`);
  await broadcast(phones, msg);
  phones.forEach(p => store.logMessage({ direction: 'outbound', phone: p, message: msg, keyword: 'CRON_DAILY' }));
}, { timezone: 'Africa/Lagos' });

// Weekly digest — every Sunday at 10:00 AM
cron.schedule('0 9 * * 0', async () => {
  const phones = store.getActiveSubscribers();
  if (!phones.length) return;
  const stats = store.getStats();
  const msg = `WildSMS Weekly: ${stats.totalMessages} messages sent, ${stats.totalReports} threats reported this week. Nigeria's wildlife thanks you. Share 35367 with a neighbour today.`;
  console.log(`[CRON] Weekly digest to ${phones.length} subscribers`);
  await broadcast(phones, msg);
}, { timezone: 'Africa/Lagos' });

// ─── START ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
  ██╗    ██╗██╗██╗     ██████╗ ███████╗███╗   ███╗███████╗
  ██║    ██║██║██║     ██╔══██╗██╔════╝████╗ ████║██╔════╝
  ██║ █╗ ██║██║██║     ██║  ██║███████╗██╔████╔██║███████╗
  ██║███╗██║██║██║     ██║  ██║╚════██║██║╚██╔╝██║╚════██║
  ╚███╔███╔╝██║███████╗██████╔╝███████║██║ ╚═╝ ██║███████║
   ╚══╝╚══╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝     ╚═╝╚══════╝

  Wildlife Awareness via SMS — Powered by Africa's Talking
  ─────────────────────────────────────────────────────────
  Server:    http://localhost:${PORT}
  Dashboard: http://localhost:${PORT}/
  Inbound webhook: POST http://localhost:${PORT}/sms/inbound
  Environment: ${process.env.NODE_ENV}
  AT Username: ${process.env.AT_USERNAME}
  Shortcode: ${process.env.AT_SMS_SHORTCODE}
  `);
});

module.exports = app;
