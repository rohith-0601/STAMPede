import twilio from 'twilio';
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
    console.log("TWILIO CONFIG:", accountSid, authToken, twilioPhone);

  try {
    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: to,
    });
    console.log(`✅ SMS sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send SMS to ${to}: ${error.message}`);
  }
};

export {sendSMS};
