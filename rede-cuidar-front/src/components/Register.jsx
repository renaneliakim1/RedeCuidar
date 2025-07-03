import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Container
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { register } from '../services/authService.js';

const Register = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: Yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref('senha'), null], 'Senhas devem ser iguais')
      .required('Confirmação de senha é obrigatória'),
  });

  const handleSubmit = async (values) => {
    try {
      await register(values.nome, values.email, values.senha);
      navigate('/login');
    } catch (error) {
      console.error('Erro no registro:', error);
    }
  };

  return (
     <Container maxWidth="sm">
          <Paper elevation={4} sx={{ mt: 8, p: 4, borderRadius: 3, backgroundColor: 'background.paper' }}>
            <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
              Criar Conta
            </Typography>

            <Formik
              initialValues={{ nome: '', email: '', senha: '', confirmarSenha: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    name="nome"
                    label="Nome Completo"
                    fullWidth
                    margin="normal"
                    error={touched.nome && !!errors.nome}
                    helperText={touched.nome && errors.nome}
                  />

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

                  <Field
                    as={TextField}
                    name="confirmarSenha"
                    label="Confirmar Senha"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={touched.confirmarSenha && !!errors.confirmarSenha}
                    helperText={touched.confirmarSenha && errors.confirmarSenha}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 3, borderRadius: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                  >
                    Registrar
                  </Button>
                </Form>
              )}
            </Formik>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link href="/login" variant="body2">
                Já tem uma conta? Faça login
              </Link>
            </Box>
          </Paper>
     </Container>
  );
};

export default Register;