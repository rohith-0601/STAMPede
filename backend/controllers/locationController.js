const User = require('../models/User');
const twilio = require('twilio');
const dotenv = require("dotenv");
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Save or update user location
exports.updateLocation = async (req, res) => {
  const { mobile, latitude, longitude } = req.body;

  if (!mobile || !latitude || !longitude)
    return res.status(400).json({ message: 'Missing data' });

  try {
    const user = await User.findOneAndUpdate(
      { mobile },
      { latitude, longitude, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    console.error("❌ Error saving location:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all user locations
exports.getAllLocations = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error("❌ Error getting locations:", err);
    res.status(500).json({ error: err.message });
  }
};

// Send alert to all numbers
exports.sendAlert = async (req, res) => {
  try {
    const users = await User.find({});
    const results = [];

    for (const user of users) {
      const fullNumber = `+91${user.mobile}`; // 🇮🇳 Change country code if needed

      try {
        console.log(`📨 Sending alert to: ${fullNumber}`);

        const msg = await client.messages.create({
          body: '🚨 STAMPede Alert! Stay safe and move to a secure area.',
          from: process.env.TWILIO_PHONE,
          to: fullNumber,
        });

        console.log(`✅ Sent to ${fullNumber} - SID: ${msg.sid}`);
        results.push({ to: fullNumber, status: 'sent', sid: msg.sid });

      } catch (smsErr) {
        console.error(`❌ Failed to send to ${fullNumber}: ${smsErr.message}`);
        results.push({ to: fullNumber, status: 'failed', error: smsErr.message });
      }
    }

    res.json({ message: 'Alert process complete', results });

  } catch (err) {
    console.error("❌ Fatal error in sendAlert:", err);
    res.status(500).json({ error: err.message });
  }
};
