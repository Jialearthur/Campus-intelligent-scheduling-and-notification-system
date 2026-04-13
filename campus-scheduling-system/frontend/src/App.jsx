import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Scheduling from './pages/Scheduling';
import Notifications from './pages/Notifications';
import Statistics from './pages/Statistics';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/members" element={user ? <Members /> : <Navigate to="/login" />} />
        <Route path="/scheduling" element={user ? <Scheduling /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
        <Route path="/statistics" element={user ? <Statistics /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;