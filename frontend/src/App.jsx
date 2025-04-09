import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './assets/css/custom.css';

// Layout Components
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import Containers from './pages/Containers';
import Experiments from './pages/Experiments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by token in localStorage
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user data');
      }
    }
    
    setLoading(false);
  }, []);

  // Simple function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          isAuthenticated ? (
            <MainLayout user={user} onLogout={handleLogout}>
              <Dashboard />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        <Route path="/servers" element={
          isAuthenticated ? (
            <MainLayout user={user} onLogout={handleLogout}>
              <Servers />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        <Route path="/containers" element={
          isAuthenticated ? (
            <MainLayout user={user} onLogout={handleLogout}>
              <Containers />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        <Route path="/experiments" element={
          isAuthenticated ? (
            <MainLayout user={user} onLogout={handleLogout}>
              <Experiments />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        <Route path="/reports" element={
          isAuthenticated ? (
            <MainLayout user={user} onLogout={handleLogout}>
              <Reports />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        <Route path="/settings" element={
          isAuthenticated ? (
            <MainLayout user={user} onLogout={handleLogout}>
              <Settings />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
