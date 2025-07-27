import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button, Container } from "react-bootstrap";
import L from "leaflet";

const MapDashboard = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`);
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const sendAlert = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/alert`);
      alert("🚨 Alert sent to all users!");
    } catch (error) {
      alert("Failed to send alerts.");
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const defaultCenter = [17.385044, 78.486671]; // Hyderabad

  return (
    <Container className="mt-3">
      <h3 className="mb-3">📍 STAMPede Admin Dashboard (Leaflet)</h3>

      <MapContainer center={defaultCenter} zoom={15} style={{ height: "80vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {users.map((user, idx) => (
          <Marker
            key={idx}
            position={[user.latitude, user.longitude]}
            icon={L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
              shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            })}
          >
            <Popup>
              <strong>User</strong><br />
              📞 {user.phoneNumber}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="d-flex justify-content-center mt-4">
        <Button variant="danger" size="lg" onClick={sendAlert}>
          🚨 Send STAMPEDE Alert
        </Button>
      </div>
    </Container>
  );
};

export default MapDashboard;
