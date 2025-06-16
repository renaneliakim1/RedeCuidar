import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Bem-vindo ao Rede Cuidar
        </Typography>
        <Typography variant="h5" paragraph>
          Conectando quem precisa de cuidados com quem pode oferecer
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/cadastro"
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Cadastre-se
          </Button>



          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/servicos"
            sx={{
              color: '#1976d2',
              borderColor: '#1976d2',
              '&:hover': { borderColor: '#1565c0' }
            }}
          >
            Encontrar Serviços
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;