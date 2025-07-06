import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
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

  const textColor = theme.palette.primary.contrastText;

  const desktopMenu = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {location.pathname !== '/' && !isAdmin && (
        <Button component={Link} to="/" sx={{ color: textColor, textTransform: 'none' }}>
          Início
        </Button>
      )}


      {!isLoggedIn ? (
        <>
          <Button component={Link} to="/login" sx={{ color: textColor, textTransform: 'none' }}>
            Login
          </Button>
          <Button component={Link} to="/cadastro" sx={{ color: textColor, textTransform: 'none' }}>
            Cadastre-se
          </Button>
        </>
      ) : isAdmin ? (
        <>
          {/* Para admin: só Sair */}
          <Button onClick={handleLogout} sx={{ color: textColor, textTransform: 'none' }}>
            Sair
          </Button>
        </>
      ) : (
        <>
          {/* Usuário normal */}
          <Button onClick={handleMenuOpen} sx={{ color: textColor, textTransform: 'none' }}>
            Minha Conta {nomeUsuario}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/perfil');
              }}
            >
              Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </>
      )}

      <Tooltip title={mode === 'dark' ? 'Tema claro' : 'Tema escuro'}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            color: textColor,
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'rotate(20deg)' },
          }}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );

  const mobileMenu = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
     {location.pathname !== '/' && !isAdmin && (
       <IconButton
         component={Link}
         to="/"
         sx={{ color: textColor, mr: 1 }}
         aria-label="Início"
         size="large"
       >
         <HomeIcon />
       </IconButton>
     )}


      <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
        <MenuIcon />
      </IconButton>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{
            width: 250,
            backgroundColor: theme.palette.background.default,
            height: '100%',
          }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <List>
            {!isLoggedIn ? (
              <>
                <ListItem component={Link} to="/login">
                  <ListItemText primary="Login" sx={{ color: theme.palette.text.primary }} />
                </ListItem>
                <ListItem component={Link} to="/cadastro">
                  <ListItemText primary="Cadastre-se" sx={{ color: theme.palette.text.primary }} />
                </ListItem>
              </>
            ) : isAdmin ? (
              <>
                <ListItem onClick={handleLogout}>
                  <ListItemText primary="Sair" sx={{ color: theme.palette.text.primary }} />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem onClick={() => navigate('/perfil')}>
                  <ListItemText primary="Perfil" sx={{ color: theme.palette.text.primary }} />
                </ListItem>
                <ListItem onClick={handleLogout}>
                  <ListItemText primary="Sair" sx={{ color: theme.palette.text.primary }} />
                </ListItem>
              </>
            )}
            <ListItem onClick={toggleTheme}>
              <ListItemText
                primary={mode === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
                sx={{ color: theme.palette.text.primary }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <Box component="img" src={logo02} alt="Rede Cuidar" sx={{ height: 40, objectFit: 'contain' }} />
        </Box>

        {isMobile ? mobileMenu : desktopMenu}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
