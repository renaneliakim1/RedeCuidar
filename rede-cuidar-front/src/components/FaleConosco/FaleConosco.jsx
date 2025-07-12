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
  Grid,
  Fade
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { motion } from 'framer-motion';
import contact from '../../assets/contact.jpg';

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
    <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <img
                src={contact}
                alt="Fale conosco"
                style={{ width: '50%', borderRadius: 8 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Fale Conosco
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Sua opinião é muito importante para nós! Preencha o formulário abaixo para enviar dúvidas, sugestões ou solicitar ajuda. Nossa equipe responderá o mais breve possível.
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
                  rows={4}
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
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default FaleConosco;
