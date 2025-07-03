import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Bloqueado = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
          color: theme.palette.text.primary,
          textAlign: 'center',
          px: 2,
          borderRadius: 2,
          boxShadow: 3,
          mt: 8,
        }}
      >
        <Typography variant="h5" gutterBottom>
          🤔 Hmm... parece que você ainda não entrou!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Para acessar os serviços e conhecer nossos profissionais, é necessário estar logado. <br />
          É rapidinho e gratuito 😁
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%' }}>
          <Button
            variant="contained"
            component={Link}
            to="/login"
            fullWidth
            size="large"
            sx={{
              backgroundColor: '#1976d2',
              borderRadius: 2,
              color: '#fff',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Entrar
          </Button>

          <Button
            variant="outlined"
            component={Link}
            to="/cadastro"
            fullWidth
            size="large"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              color: '#1976d2',
              borderColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#e3f2fd',
                borderColor: '#1565c0',
                color: '#1565c0',
              },
            }}
          >
            Cadastrar-se
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Bloqueado;
