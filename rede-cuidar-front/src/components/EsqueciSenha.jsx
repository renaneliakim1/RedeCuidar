import { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Alert } from '@mui/material';
import emailjs from '@emailjs/browser';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const EsqueciSenha = () => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleEnviar = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');
    setCarregando(true);

    try {
      const token = uuidv4();

      await axios.post('http://localhost:8080/api/auth/salvar-token', {
        email,
        token,
      });

      const templateParams = {
        to_email: email,
        message: `Olá! Clique no link para redefinir sua senha: http://localhost:5173/redefinir-senha?token=${token}`,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setMensagem('Um link de redefinição de senha foi enviado para seu e-mail.');
    } catch (err) {
      console.error(err);
      setErro('Erro ao enviar o e-mail. Verifique se o e-mail está correto.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ mt: 8, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
          Recuperar Senha
        </Typography>

        {mensagem && <Alert severity="success">{mensagem}</Alert>}
        {erro && <Alert severity="error">{erro}</Alert>}

        <form onSubmit={handleEnviar}>
          <TextField
            label="E-mail cadastrado"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={carregando}>
            {carregando ? 'Enviando...' : 'Enviar link de redefinição'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EsqueciSenha;
