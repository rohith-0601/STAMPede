import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const sendLocation = async (mobile, latitude, longitude) => {
  try {
    await axios.post(`${BASE}/location`, { mobile, latitude, longitude });
  } catch (err) {
    console.error(err);
  }
};

export const getAllLocations = async () => {
  try {
    const res = await axios.get(`${BASE}/location/all`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const triggerAlert = async () => {
  try {
    await axios.post(`${BASE}/location/alert`);
  } catch (err) {
    console.error('Error sending alert:', err);
  }
};
