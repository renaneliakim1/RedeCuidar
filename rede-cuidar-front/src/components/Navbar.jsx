import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useThemeContext } from './ThemeContext';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { toggleTheme, mode } = useThemeContext();

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
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          RedeCuidar
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/cadastro">
                Cadastre-se
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleMenuOpen}>
                Minha Conta {nomeUsuario}
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/perfil'); }}>Perfil</MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>Sair</MenuItem>
              </Menu>
            </>
          )}

          {/* 🔘 Botão de tema claro/escuro */}
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
                color="secondary"
              />
            }
            label={mode === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
            labelPlacement="start"
            sx={{ color: 'white' }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
