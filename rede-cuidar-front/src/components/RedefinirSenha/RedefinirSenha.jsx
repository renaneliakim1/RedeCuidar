import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  TextField, Button, Typography, Container, Paper, Alert,
  InputAdornment, IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const RedefinirSenha = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setMensagem('');
      setErro('');

      if (!token) {
        setErro('Token inválido ou expirado.');
        return;
      }

      if (!novaSenha || novaSenha.length < 6) {
        setErro('A senha deve ter pelo menos 6 caracteres.');
        return;
      }

      try {
        await axios.post('http://localhost:8080/api/auth/redefinir-senha', {
          token,
          novaSenha
        });

        setMensagem('Senha redefinida com sucesso! Redirecionando para login...');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        console.error(err);
        setErro('Erro ao redefinir senha. Verifique o link ou tente novamente.');
      }
    };


  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ mt: 8, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
          Redefinir Senha
        </Typography>

        {mensagem && <Alert severity="success">{mensagem}</Alert>}
        {erro && <Alert severity="error">{erro}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nova senha"
            type={mostrarSenha ? 'text' : 'password'}
            fullWidth
            required
            margin="normal"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setMostrarSenha(!mostrarSenha)}>
                    {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Redefinir Senha
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default RedefinirSenha;
