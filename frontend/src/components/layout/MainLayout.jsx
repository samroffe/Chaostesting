import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faServer, 
  faCubes, 
  faFlask, 
  faChartBar, 
  faCog, 
  faUserCircle,
  faRandom,
  faShieldAlt,
  faBars
} from '@fortawesome/free-solid-svg-icons';

// Material UI components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import { useState } from 'react';

const MainLayout = ({ children, user }) => {
  const location = useLocation();
  const username = user?.username || "Admin";
  const isAdmin = user?.isAdmin || false;
  
  // Menu state
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Navigation items
  const navItems = [
    { name: 'Dashboard', icon: faTachometerAlt, path: '/' },
    { name: 'Servers', icon: faServer, path: '/servers' },
    { name: 'Containers', icon: faCubes, path: '/containers' },
    { name: 'Experiments', icon: faFlask, path: '/experiments' },
    { name: 'Reports', icon: faChartBar, path: '/reports' },
  ];
  
  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <FontAwesomeIcon icon={faRandom} style={{ marginRight: '10px' }} />
        <Typography variant="h6" component="div">
          Chaos Engineering
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.name} 
            component={Link} 
            to={item.path}
            selected={location.pathname === item.path}
            sx={{ 
              color: 'text.primary',
              '&.Mui-selected': {
                backgroundColor: 'rgba(252, 82, 35, 0.1)',
                borderLeft: '3px solid #fc5223',
              }
            }}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={item.icon} color={location.pathname === item.path ? '#fc5223' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo for desktop */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <FontAwesomeIcon icon={faRandom} style={{ marginRight: '10px' }} />
              Chaos Engineering
            </Typography>

            {/* Mobile menu button */}
            <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <FontAwesomeIcon icon={faBars} />
              </IconButton>
            </Box>
            
            {/* Logo for mobile */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Chaos Engineering
            </Typography>
            
            {/* Navigation for desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: location.pathname === item.path ? '2px solid #fc5223' : 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} style={{ marginRight: '6px' }} />
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* User menu */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#fc5223', width: 32, height: 32 }}>
                      {username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography sx={{ ml: 1, display: { xs: 'none', md: 'flex' } }}>
                      {username}
                      {isAdmin && (
                        <Badge 
                          color="error" 
                          badgeContent="Admin" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                  </Box>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem component={Link} to="/settings" onClick={handleCloseUserMenu}>
                  <FontAwesomeIcon icon={faCog} style={{ marginRight: '8px' }} />
                  <Typography textAlign="center">Settings</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Drawer for mobile */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, pt: 10, pb: 3, px: 3 }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; 2025 Chaos Engineering Tool | 
            <Link to="https://github.com" color="inherit" sx={{ ml: 1 }}>
              GitHub
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;