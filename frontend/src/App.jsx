import MapDashboard from "./components/MapDashboard";
import UserForm from "./components/UserForm";

function App() {
  const refreshMap = () => {
    // Optional: trigger refresh on map component
  };

  return (
    <>
      <MapDashboard />
      <UserForm onUserRegistered={refreshMap} />
    </>
  );
}

export default App;
