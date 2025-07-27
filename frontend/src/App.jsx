import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { sendLocation, getAllLocations, triggerAlert } from './api';

const App = () => {
  const [input, setInput] = useState('');
  const [mobile, setMobile] = useState('');
  const [coords, setCoords] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (!mobile) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        await sendLocation(mobile, latitude, longitude);
      },
      err => console.error(err),
      { enableHighAccuracy: true }
    );

    const interval = setInterval(fetchAll, 4000);
    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(interval);
    };
  }, [mobile]);

  const fetchAll = async () => {
    const users = await getAllLocations();
    setAllUsers(users);
  };

  const handleSubmit = () => {
    if (input.length === 10) {
      setMobile(input);
    } else {
      alert('Please enter a valid 10-digit number');
    }
  };

  const handleAlert = async () => {
    await triggerAlert();
    alert('🚨 Alert sent to all users!');
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>STAMPede</h2>

        {!mobile ? (
          <>
            <label htmlFor="mobile">Your Mobile Number:</label>
            <input
              type="text"
              id="mobile"
              placeholder="e.g. 9876543210"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={10}
            />
            <button className="primary-btn" onClick={handleSubmit}>
              Start Tracking
            </button>
          </>
        ) : (
          <>
            <p><strong>Mobile:</strong> {mobile}</p>
            <button className="alert-btn" onClick={handleAlert}>
              🚨 Send Alert to All
            </button>
          </>
        )}
      </div>

      <div className="map-container">
        <MapContainer
          center={coords ? [coords.latitude, coords.longitude] : [20.5, 78.9]}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {coords && (
            <Marker position={[coords.latitude, coords.longitude]}>
              <Popup>You</Popup>
            </Marker>
          )}

          {allUsers.map((u, i) => (
            <Marker key={i} position={[u.latitude, u.longitude]}>
              <Popup>{u.mobile}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
