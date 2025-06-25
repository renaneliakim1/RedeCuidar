import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  Container,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: Yup.string().required('Senha é obrigatória'),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setError('Por favor, confirme que você não é um robô.');
      setLoading(false);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('email', values.email);
      formData.append('senha', values.senha);
      formData.append('captchaToken', captchaToken);

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const texto = await response.text();

      if (response.ok) {
        localStorage.setItem('token', 'logado');
        localStorage.setItem('email', values.email);
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      } else {
        throw new Error(texto || 'Credenciais inválidas');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ email: '', senha: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <TextField
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />

              <TextField
                name="senha"
                label="Senha"
                fullWidth
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={values.senha}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.senha && !!errors.senha}
                helperText={touched.senha && errors.senha}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LdfhWwrAAAAAKasgt0KNn1C5w48Volp0IVzK4HO"
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Entrar'}
              </Button>
            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/cadastro" variant="body2">
            Não tem uma conta? Registre-se
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
