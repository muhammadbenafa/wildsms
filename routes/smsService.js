if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const AfricasTalking = require('africastalking');

const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

const sms = at.SMS;
const shortcode = process.env.AT_SMS_SHORTCODE || '35367';

async function sendSMS(to, message) {
  const recipients = Array.isArray(to) ? to : [to];
  try {
    const result = await sms.send({
      to: recipients,
      message,
      from: shortcode
    });
    console.log(`[WildSMS] Sent to ${recipients.length} recipient(s):`, result.SMSMessageData?.Message);
    return { success: true, result };
  } catch (err) {
    console.error('[WildSMS] Send error:', err.message || err);
    return { success: false, error: err.message || String(err) };
  }
}

async function broadcast(phones, message) {
  if (!phones.length) return { success: false, error: 'No active subscribers' };
  // AT allows up to 1000 numbers per call — chunk if needed
  const chunks = [];
  for (let i = 0; i < phones.length; i += 1000) {
    chunks.push(phones.slice(i, i + 1000));
  }
  const results = await Promise.all(chunks.map(chunk => sendSMS(chunk, message)));
  return results;
}

module.exports = { sendSMS, broadcast };
