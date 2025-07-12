import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HomeIcon from '@mui/icons-material/Home';
import { useThemeContext } from './ThemeContext';
import logo02 from '../assets/logo02.png';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { toggleTheme, mode } = useThemeContext();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nome = localStorage.getItem('nomeUsuario');
    setIsLoggedIn(token === 'logado');
    setNomeUsuario(nome || '');

    const handleAuthChange = () => {
      const updatedToken = localStorage.getItem('token');
      const updatedNome = localStorage.getItem('nomeUsuario');
      setIsLoggedIn(updatedToken === 'logado');
      setNomeUsuario(updatedNome || '');
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
    handleMenuClose();
  };

  const navButtonStyle = {
    color: '#ffffff',
    fontWeight: 600,
    borderRadius: 1,
    textTransform: 'none',
    px: 2,
    backgroundColor: 'transparent',
    '&:hover': {
      color: theme.palette.mode === 'light' ? '#0d47a1' : '#64b5f6',
    },
  };

  const drawerItemStyle = {
    color: theme.palette.text.primary,
    '&:hover': {
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  };

  const desktopMenu = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {location.pathname !== '/' && !isAdmin && (
        <Button component={Link} to="/" sx={navButtonStyle}>Início</Button>
      )}

      {!isLoggedIn ? (
        <>
          {location.pathname !== '/login' && (
            <Button component={Link} to="/login" sx={navButtonStyle}>Login</Button>
          )}
          {location.pathname !== '/cadastro' && (
            <Button component={Link} to="/cadastro" sx={navButtonStyle}>Cadastre-se</Button>
          )}
        </>
      ) : isAdmin ? (
        <Button onClick={handleLogout} sx={navButtonStyle}>Sair</Button>
      ) : (
        <>
          <Button onClick={handleMenuOpen} sx={navButtonStyle}>Minha Conta {nomeUsuario}</Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => { handleMenuClose(); navigate('/perfil'); }}
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: theme.palette.mode === 'light' ? '#0d47a1' : '#64b5f6',
                  textDecoration: 'none',
                },
              }}
            >
              Perfil
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: theme.palette.mode === 'light' ? '#0d47a1' : '#64b5f6',
                  textDecoration: 'none',
                },
              }}
            >
              Sair
            </MenuItem>


          </Menu>
        </>
      )}

      <Tooltip title={mode === 'dark' ? 'Tema claro' : 'Tema escuro'}>
        <IconButton onClick={toggleTheme} sx={{ color: '#ffffff' }}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );

  const mobileMenu = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {!isAdmin && location.pathname !== '/' && (
        <IconButton component={Link} to="/" sx={{ color: navButtonStyle.color }}>
          <HomeIcon />
        </IconButton>
      )}

      <IconButton edge="end" color="inherit" onClick={() => setDrawerOpen(true)}>
        <MenuIcon />
      </IconButton>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{ width: 250, backgroundColor: theme.palette.background.default, height: '100%' }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <List>
            {!isLoggedIn ? (
              <>
                {location.pathname !== '/login' && (
                  <ListItem component={Link} to="/login">
                    <ListItemText primary="Login" sx={drawerItemStyle} />
                  </ListItem>
                )}
                {location.pathname !== '/cadastro' && (
                  <ListItem component={Link} to="/cadastro">
                    <ListItemText primary="Cadastre-se" sx={drawerItemStyle} />
                  </ListItem>
                )}
              </>
            ) : isAdmin ? (
              <ListItem onClick={handleLogout}>
                <ListItemText primary="Sair" sx={drawerItemStyle} />
              </ListItem>
            ) : (
              <>
                <ListItem onClick={() => navigate('/perfil')}>
                  <ListItemText primary="Perfil" sx={drawerItemStyle} />
                </ListItem>
                <ListItem onClick={handleLogout}>
                  <ListItemText primary="Sair" sx={drawerItemStyle} />
                </ListItem>
              </>
            )}
            <Divider />
            <ListItem onClick={toggleTheme}>
              <ListItemText primary={mode === 'dark' ? 'Tema Claro' : 'Tema Escuro'} sx={drawerItemStyle} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Box component="img" src={logo02} alt="Rede Cuidar" sx={{ height: 40, objectFit: 'contain' }} />
        </Box>
        {isMobile ? mobileMenu : desktopMenu}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
