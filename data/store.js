// In-memory store (replace with a database like MongoDB/Postgres in production)

const subscribers = new Map();
const reports = [];
const storyProgress = new Map(); // phone -> { storyId, part }
const messageLog = [];

function subscribe(phone) {
  if (!subscribers.has(phone)) {
    subscribers.set(phone, {
      phone,
      joinedAt: new Date().toISOString(),
      messagesSent: 0,
      reportsSubmitted: 0,
      active: true
    });
    return true; // new subscriber
  } else {
    subscribers.get(phone).active = true;
    return false; // already existed
  }
}

function unsubscribe(phone) {
  if (subscribers.has(phone)) {
    subscribers.get(phone).active = false;
  }
}

function isSubscribed(phone) {
  return subscribers.has(phone) && subscribers.get(phone).active;
}

function getActiveSubscribers() {
  return [...subscribers.values()].filter(s => s.active).map(s => s.phone);
}

function logMessage({ direction, phone, message, keyword }) {
  messageLog.push({
    id: messageLog.length + 1,
    direction,
    phone: maskPhone(phone),
    message: message.substring(0, 80) + (message.length > 80 ? '...' : ''),
    keyword: keyword || null,
    timestamp: new Date().toISOString()
  });
  if (subscribers.has(phone) && direction === 'outbound') {
    subscribers.get(phone).messagesSent++;
  }
}

function addReport({ phone, type, details, timestamp }) {
  const report = {
    id: reports.length + 1,
    phone: maskPhone(phone),
    type,
    details,
    status: 'new',
    timestamp: timestamp || new Date().toISOString()
  };
  reports.push(report);
  if (subscribers.has(phone)) {
    subscribers.get(phone).reportsSubmitted++;
  }
  return report;
}

function getStoryProgress(phone) {
  return storyProgress.get(phone) || { storyId: 0, part: 0 };
}

function setStoryProgress(phone, storyId, part) {
  storyProgress.set(phone, { storyId, part });
}

function maskPhone(phone) {
  if (!phone || phone.length < 8) return phone;
  return phone.substring(0, 4) + '****' + phone.slice(-3);
}

function getStats() {
  return {
    totalSubscribers: subscribers.size,
    activeSubscribers: getActiveSubscribers().length,
    totalReports: reports.length,
    totalMessages: messageLog.length,
    recentMessages: messageLog.slice(-20).reverse(),
    recentReports: reports.slice(-10).reverse()
  };
}

module.exports = {
  subscribe, unsubscribe, isSubscribed,
  getActiveSubscribers, logMessage, addReport,
  getStoryProgress, setStoryProgress, getStats, reports, messageLog
};
