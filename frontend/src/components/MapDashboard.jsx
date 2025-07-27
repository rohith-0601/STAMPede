import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Button, Container } from "react-bootstrap";

const MapDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapContainerStyle = {
    width: "100%",
    height: "90vh",
  };

  const center = {
    lat: 17.385044, // Hyderabad center (adjust as needed)
    lng: 78.486671,
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`);
      setUsers(res.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const sendAlert = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/alert`);
      alert("🚨 Alerts sent to all users!");
    } catch (error) {
      alert("Failed to send alerts.");
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000); // Refresh every 5 sec (simulate live)
    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="mt-3">
      <h3 className="mb-3">📍 STAMPede Admin Dashboard</h3>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
        >
          {!loading &&
            users.map((user, idx) => (
              <Marker
                key={idx}
                position={{
                  lat: user.latitude,
                  lng: user.longitude,
                }}
              />
            ))}
        </GoogleMap>
      </LoadScript>

      <div className="d-flex justify-content-center mt-4">
        <Button variant="danger" size="lg" onClick={sendAlert}>
          🚨 Send STAMPEDE Alert
        </Button>
      </div>
    </Container>
  );
};

export default MapDashboard;
