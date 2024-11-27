import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';
import RedirectToDashboard from './components/RedirectToDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<RedirectToDashboard />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
