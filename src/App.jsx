import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ResumeCreator from './pages/ResumeCreator';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><AuthPage type="login" /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><AuthPage type="register" /></PublicRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/creator" element={<ProtectedRoute><ResumeCreator /></ProtectedRoute>} />
          <Route path="/creator/:id" element={<ProtectedRoute><ResumeCreator /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
