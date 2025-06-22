import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUsuario');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nome = localStorage.getItem("nomeUsuario");

    setIsLoggedIn(token === "logado");
    setNomeUsuario(nome || '');

    const handleAuthChange = () => {
      const updatedToken = localStorage.getItem("token");
      const updatedNome = localStorage.getItem("nomeUsuario");

      setIsLoggedIn(updatedToken === "logado");
      setNomeUsuario(updatedNome || '');
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          RedeCuidar
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ textTransform: 'none' }}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/cadastro" sx={{ textTransform: 'none' }}>
                Cadastre-se
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ textTransform: 'none' }}
              >
                Minha Conta {nomeUsuario}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate('/perfil');
                  }}
                >
                  Perfil
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                >
                  Sair
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
