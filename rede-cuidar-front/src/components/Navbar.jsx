import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* Logo que redireciona para Home */}
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

        {/* Links de Navegação */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Link para Login */}
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={{ textTransform: 'none' }}
          >
            Login
          </Button>

          {/* Link para Cadastro */}
          <Button
            color="inherit"
            component={Link}
            to="/cadastro"  // Ou "/cadastro"
            sx={{ textTransform: 'none' }}

          >
            Cadastre-se
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;