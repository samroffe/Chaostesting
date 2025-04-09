import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/css/custom.css';

// Layout Components
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import Containers from './pages/Containers';
import Experiments from './pages/Experiments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  // Mock user data for navigation display
  const mockUser = {
    username: 'Admin',
    email: 'admin@example.com',
    isAdmin: true
  };

  return (
    <Router>
      <Routes>
        {/* All routes accessible without authentication */}
        <Route path="/" element={
          <MainLayout user={mockUser}>
            <Dashboard />
          </MainLayout>
        } />
        
        <Route path="/servers" element={
          <MainLayout user={mockUser}>
            <Servers />
          </MainLayout>
        } />
        
        <Route path="/containers" element={
          <MainLayout user={mockUser}>
            <Containers />
          </MainLayout>
        } />
        
        <Route path="/experiments" element={
          <MainLayout user={mockUser}>
            <Experiments />
          </MainLayout>
        } />
        
        <Route path="/reports" element={
          <MainLayout user={mockUser}>
            <Reports />
          </MainLayout>
        } />
        
        <Route path="/settings" element={
          <MainLayout user={mockUser}>
            <Settings />
          </MainLayout>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
