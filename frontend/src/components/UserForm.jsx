import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Card } from "react-bootstrap";

const UserForm = ({ onUserRegistered }) => {
  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem("phoneNumber") || "");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(localStorage.getItem("isRegistered") === "true");

  // 🔄 Auto-fetch user location when component mounts
  useEffect(() => {
    if (isRegistered) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => {
        console.error("❌ Location error:", err);
        setMessage("❌ Please allow location access.");
      }
    );
  }, [isRegistered]);

  // ✅ Submit phone + location to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude || !phoneNumber) {
      setMessage("❌ Missing data.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        phoneNumber,
        latitude,
        longitude,
      });

      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("isRegistered", "true");
      setIsRegistered(true);
      setMessage("✅ You are now being tracked on the map!");

      if (onUserRegistered) onUserRegistered();
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Registration failed.");
    }
  };

  // 🧠 Movement simulation — update location every 7s
  useEffect(() => {
    let interval;

    if (isRegistered && phoneNumber && latitude && longitude) {
      interval = setInterval(() => {
        const newLat = latitude + (Math.random() - 0.5) * 0.0005;
        const newLng = longitude + (Math.random() - 0.5) * 0.0005;

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, {
          phoneNumber,
          latitude: newLat,
          longitude: newLng,
        });

        setLatitude(newLat);
        setLongitude(newLng);
      }, 7000);
    }

    return () => clearInterval(interval);
  }, [isRegistered, phoneNumber, latitude, longitude]);

  // 🔄 Reset form and localStorage
  const resetUser = () => {
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("isRegistered");
    setPhoneNumber("");
    setIsRegistered(false);
    setMessage("🔁 You can now register again.");
  };

  return (
    <Card className="p-4 mt-4 shadow">
      <h5>📍 Join the Crowd</h5>

      {isRegistered ? (
        <>
          <p>✅ You’re registered and moving on the map.</p>
          <Button variant="secondary" onClick={resetUser}>
            Reset Registration
          </Button>
        </>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="phoneNumber" className="mb-3">
            <Form.Label>Enter Your Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="+91XXXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" disabled={!latitude || !phoneNumber}>
            Register & Share Location
          </Button>
        </Form>
      )}

      {message && <p className="mt-3">{message}</p>}
    </Card>
  );
};

export default UserForm;
