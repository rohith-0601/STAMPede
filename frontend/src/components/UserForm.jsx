import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Card } from "react-bootstrap";

const UserForm = ({ onUserRegistered }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => {
        console.error("Failed to get location", err);
        setMessage("❌ Allow location access to register.");
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      setMessage("❌ Location not available. Try again.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        phoneNumber,
        latitude,
        longitude,
      });

      setMessage("✅ You’ve been registered!");
      onUserRegistered && onUserRegistered(); // optional map refresh
    } catch (error) {
      setMessage("❌ Registration failed.");
    }
  };

  return (
    <Card className="p-4 mt-4">
      <h5>📍 Join Live Crowd</h5>
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

        <Button type="submit" variant="primary" disabled={!latitude}>
          Register & Share Location
        </Button>
      </Form>

      {message && <p className="mt-3">{message}</p>}
    </Card>
  );
};

export default UserForm;
