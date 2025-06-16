import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  Container
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: Yup.string().required('Senha é obrigatória'),
  });

  const handleSubmit = async (values) => {
    try {
      await login(values.email, values.senha);
      navigate('/');
    } catch (error) {
      setError('Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2
      }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
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
              >
                Entrar
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