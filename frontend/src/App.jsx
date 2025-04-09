import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './assets/css/custom.css';

// Layout Components
import MainLayout from './components/layout/MainLayout';

// Create a dark theme with orange accents
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fc5223',
    },
    secondary: {
      main: '#5cb85c',
    },
    background: {
      default: '#1a1d21',
      paper: '#2a2d34',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#a0a3a9',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.25)',
          },
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1d21',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }
      }
    }
  }
});

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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
  </ThemeProvider>
  );
}

export default App;
