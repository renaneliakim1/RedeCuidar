import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  Container,
  CircularProgress
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: Yup.string().required('Senha é obrigatória'),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      // Transformar os parâmetros para form-url-encoded
      const formData = new URLSearchParams();
      formData.append('email', values.email);
      formData.append('senha', values.senha);

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        navigate('/');
      } else {
        const responseData = await response.text();
        throw new Error(responseData || 'Credenciais inválidas');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
          {({ errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />

              <Field
                as={TextField}
                name="senha"
                label="Senha"
                type="password"
                fullWidth
                margin="normal"
                error={touched.senha && !!errors.senha}
                helperText={touched.senha && errors.senha}
              />

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
