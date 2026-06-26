# WildSMS 🌿
### Wildlife Awareness Platform — Powered by Africa's Talking SMS API

> Connecting rural Nigerian communities to wildlife conservation through SMS — no smartphone, no data, no barriers.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Credentials are already in .env — ready to go for sandbox testing

# 3. Start the server
npm start

# 4. Open the dashboard
open http://localhost:3000
```

---

## Project Structure

```
wildsms/
├── server.js              # Express app + cron jobs
├── .env                   # Africa's Talking credentials
├── package.json
├── data/
│   ├── content.js         # All SMS stories, facts, and message templates
│   └── store.js           # In-memory subscriber + report store
├── routes/
│   ├── sms.js             # Inbound SMS webhook — handles all keyword flows
│   ├── broadcast.js       # Broadcast endpoints (fact, story, custom)
│   └── smsService.js      # Africa's Talking SDK wrapper
└── public/
    └── index.html         # Dashboard UI
```

---

## SMS Keywords

| Keyword | Action |
|---------|--------|
| `JOIN` | Subscribe to WildSMS |
| `FACT` | Receive a daily wildlife fact |
| `STORY` | Start a 3-part wildlife story |
| `MORE` | Continue the current story |
| `REPORT POACH` | Report illegal hunting |
| `REPORT FIRE` | Report a forest fire |
| `REPORT TRAP` | Report a snare/trap found |
| `REPORT TRADE` | Report illegal wildlife sale |
| `STOP` | Unsubscribe |
| `HELP` | Show help menu |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/sms/inbound` | Africa's Talking webhook (inbound SMS) |
| `POST` | `/sms/delivery` | Delivery report callback |
| `POST` | `/broadcast/fact` | Trigger daily fact broadcast |
| `POST` | `/broadcast/story` | Broadcast story start to all subscribers |
| `POST` | `/broadcast/custom` | Send custom message (`{ message, phone? }`) |
| `GET`  | `/api/stats` | Dashboard stats (JSON) |
| `GET`  | `/api/reports` | All threat reports (JSON) |
| `GET`  | `/api/messages` | Message log (JSON) |

---

## Going Live (Production)

### 1. Deploy your server
Deploy to Railway, Render, Heroku, or any VPS. Get a public HTTPS URL.

### 2. Set webhook in Africa's Talking dashboard
- Go to: **AT Dashboard → SMS → Shortcodes → [Your shortcode] → Callback URL**
- Set to: `https://yourdomain.com/sms/inbound`

### 3. Switch from sandbox to production
In `.env`:
```
AT_USERNAME=your_actual_at_username   # Not 'sandbox'
NODE_ENV=production
```

### 4. Add a real database
Replace `data/store.js` with MongoDB or PostgreSQL for persistence across restarts.

---

## Cron Schedule

| Job | Time | Action |
|-----|------|--------|
| Daily fact | 8:00 AM (WAT) | Broadcasts one wildlife fact to all subscribers |
| Weekly digest | 10:00 AM Sunday (WAT) | Sends weekly summary + call to action |

---

## Built With
- [Africa's Talking SMS API](https://africastalking.com) — SMS delivery
- [Express.js](https://expressjs.com) — HTTP server
- [node-cron](https://github.com/node-cron/node-cron) — Scheduled broadcasts
- Space Grotesk + Space Mono — Dashboard typography

---

*WildSMS — Because every Nigerian with a phone is a potential wildlife guardian.*
