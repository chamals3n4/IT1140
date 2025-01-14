import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import MediAlarm from "./pages/MediAlarm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Private Routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route element={<Dashboard />}>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/medi-alarm" element={<MediAlarm />} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
