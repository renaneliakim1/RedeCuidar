import { useState, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  IconButton,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const Login = () => {
  const theme = useTheme();
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
        const payload = {
          email: values.email,
          senha: values.senha,
          captchaToken: captchaToken,

        };

        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const texto = await response.text();

        if (response.ok) {
          const isAdmin = values.email.trim().toLowerCase() === 'admin@redecuidar.com';

          localStorage.setItem('token', 'logado');
          localStorage.setItem('email', values.email);
          localStorage.setItem('isAdmin', isAdmin.toString());

          window.dispatchEvent(new Event('authChange'));
          navigate(isAdmin ? '/admin' : '/');
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


      const textFieldStyles = {
        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
        input: {
          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
        },
        '& input::placeholder': {
          color: theme.palette.mode === 'dark' ? '#bbb' : '#888',
          opacity: 1,
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.mode === 'dark' ? '#bbb' : undefined,
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: theme.palette.mode === 'dark' ? '#90caf9' : undefined,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#555' : undefined,
          },
          '&:hover fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#888' : undefined,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#90caf9' : undefined,
          },
        },
      };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ mt: 8, p: 4, borderRadius: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
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
                sx={textFieldStyles}
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
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" aria-label="toggle password visibility">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 2, borderRadius: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Entrar'}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link component={RouterLink} to="/esqueci-senha" variant="body2">
                  Esqueci minha senha
                </Link>
              </Box>


            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/cadastro" variant="body2">
            Não tem uma conta? Registre-se
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
