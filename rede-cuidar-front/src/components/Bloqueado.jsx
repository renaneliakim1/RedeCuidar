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
          mt: 8
        }}
      >

        <Typography variant="h5" gutterBottom>
          🤔 Hmm... parece que você ainda não entrou!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Para acessar os serviços e conhecer nossos profissionais, é necessário estar logado. <br />
          É rapidinho e gratuito 😁
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="primary" component={Link} to="/login">
            Entrar
          </Button>
          <Button variant="outlined" color="primary" component={Link} to="/cadastro">
            Cadastrar-se
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Bloqueado;
