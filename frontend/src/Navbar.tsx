/**
 * Navigation Bar Component
 * Features: Logo, Menu, Profile, Login/Logout, Notifications
 */

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Tooltip,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Movie as MovieIcon,
  LocalActivity as TicketIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Theaters,
  Notifications,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    setIsLoggedIn(!!token);
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'User');
        setIsAdmin(userData.user_type === 'ADMINISTRATOR');
      } catch (e) {
        setUserName('User');
        setIsAdmin(false);
      }
    }
  }, [location]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    handleCloseUserMenu();
    navigate('/login');
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Movies', icon: <MovieIcon />, path: '/movies' },
    ...(isLoggedIn
      ? [
          { text: 'My Bookings', icon: <TicketIcon />, path: '/my-bookings' },
          { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
        ]
      : []),
    ...(isAdmin
      ? [{ text: 'Admin', icon: <DashboardIcon />, path: '/admin' }]
      : []),
  ];

  const userMenuItems = isLoggedIn
    ? [
        { text: 'My Profile', icon: <PersonIcon />, action: () => navigate('/profile') },
        { text: 'My Bookings', icon: <TicketIcon />, action: () => navigate('/my-bookings') },
        { text: 'Logout', icon: <LogoutIcon />, action: handleLogout },
      ]
    : [
        { text: 'Login', icon: <LoginIcon />, action: () => navigate('/login') },
        { text: 'Register', icon: <PersonIcon />, action: () => navigate('/register') },
      ];

  // Mobile Drawer
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Theaters sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Theatre MS
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              toggleMobileDrawer();
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {isLoggedIn && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Logged in as
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {userName}
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo - Desktop */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 4, cursor: 'pointer' }} onClick={() => navigate('/')}>
                <Theaters sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
                <Typography
                  variant="h5"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '.1rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  Theatre MS
                </Typography>
              </Box>
            )}

            {/* Logo - Mobile */}
            {isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Theaters sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Theatre MS
                </Typography>
              </Box>
            )}

            {/* Desktop Menu Items */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: 'white',
                      borderBottom: location.pathname === item.path ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right Side Icons */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {/* Notifications - Only when logged in */}
              {isLoggedIn && (
                <Tooltip title="Notifications">
                  <IconButton color="inherit">
                    <Badge badgeContent={0} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {/* User Menu */}
              <Tooltip title={isLoggedIn ? 'Account' : 'Login'}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                  {isLoggedIn ? (
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {userName.charAt(0).toUpperCase()}
                    </Avatar>
                  ) : (
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <LoginIcon />
                    </Avatar>
                  )}
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
                {isLoggedIn && (
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {userName}
                    </Typography>
                  </MenuItem>
                )}
                {isLoggedIn && <Divider />}
                {userMenuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={() => {
                      item.action();
                      handleCloseUserMenu();
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Typography textAlign="center">{item.text}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileDrawerOpen} onClose={toggleMobileDrawer}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
