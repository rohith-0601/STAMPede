import User from "../models/userModel.js";
import {sendSMS} from "../utils/twilioClient.js";

const registerUser = async (req, res) => {
  try {
    const { phoneNumber, latitude, longitude } = req.body;

    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { latitude, longitude, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const sendAlertToAll = async (req, res) => {
  try {
    const users = await User.find();
    const alertMessage =
      "⚠️ STAMPEDE ALERT! Evacuate the area calmly and stay safe.";

    for (const user of users) {
      await sendSMS(`+91${user.phoneNumber}`, alertMessage);

    }

    res.status(200).json({ message: "Alerts sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send alerts" });
  }
};

export { registerUser, getAllUsers, sendAlertToAll };
