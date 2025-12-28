import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AgentDashboard from './components/AgentDashboard';
import ClientDashboard from './components/ClientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './api/services';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              authService.hasRole('AGENT_GUICHET') ? (
                <Navigate to="/agent" replace />
              ) : (
                <Navigate to="/client" replace />
              )
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        
        <Route 
          path="/agent" 
          element={
            <ProtectedRoute requiredRole="AGENT_GUICHET">
              <AgentDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/client" 
          element={
            <ProtectedRoute requiredRole="CLIENT">
              <ClientDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
