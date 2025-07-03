import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from '../components/Navbar';

const FaleConosco = () => {
  const formRef = useRef(null);
  const recaptchaRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      setErro('Por favor, confirme que você não é um robô.');
      return;
    }

    setLoading(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setMensagem('Mensagem enviada com sucesso!');
          formRef.current.reset();
          recaptchaRef.current.reset();
        },
        (error) => {
          console.error('Erro ao enviar:', error);
          setErro('Erro ao enviar a mensagem. Tente novamente mais tarde.');
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: 'background.paper' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Fale Conosco
          </Typography>

          {mensagem && (
            <Alert severity="success" sx={{ my: 2 }} onClose={() => setMensagem('')}>
              {mensagem}
            </Alert>
          )}

          {erro && (
            <Alert severity="error" sx={{ my: 2 }} onClose={() => setErro('')}>
              {erro}
            </Alert>
          )}

          <form ref={formRef} onSubmit={handleSubmit}>
            <TextField
              name="from_name"
              label="Seu nome"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="reply_to"
              label="Seu email"
              type="email"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="message"
              label="Mensagem"
              multiline
              rows={5}
              fullWidth
              margin="normal"
              required
            />

            <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                ref={recaptchaRef}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Enviar'}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default FaleConosco;
