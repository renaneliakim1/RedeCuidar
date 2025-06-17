import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Grid,
  Typography,
  Box,
  Alert
} from '@mui/material';
import axios from 'axios';


const CadastroUsuario = () => {
   const navigate = useNavigate();
   const [error, setError] = useState('');


    const Especialidade = {

      CUIDADOR: 'CUIDADOR',
      BABA: 'BABA',
      ENFERMEIRO: 'ENFERMEIRO',
      FISIOTERAPEUTA: 'FISIOTERAPEUTA',
      MEDICO: 'MEDICO',
      PSICOLOGO: 'PSICOLOGO',
      NUTRICIONISTA: 'NUTRICIONISTA',
      BARBEIRO_A_DOMICILIO: 'BARBEIRO_A_DOMICILIO',
      FAXINEIRO: 'FAXINEIRO'
    };

   // Corrigindo o esquema de validação
// Schema de validação CORRIGIDO:
const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: Yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
  telefone: Yup.string().required('Telefone é obrigatório'),
  endereco: Yup.string().required('Endereço é obrigatório'),
  ofereceServico: Yup.boolean().required(), // é um booleano
  especialidade: Yup.string().when('ofereceServico', {
    is: true,
    then: (schema) => schema.required('Especialidade é obrigatória para prestadores'),
    otherwise: (schema) => schema.notRequired()
  }),
  descricaoServico: Yup.string().when('ofereceServico', {
    is: true,
    then: (schema) => schema.required('Descrição do serviço é obrigatória'),
    otherwise: (schema) => schema.notRequired()
  })
});



    const handleSubmit = async (values, { setSubmitting, resetForm  }) => {
      try {
        const usuarioData = {
          ...values,
          avaliacaoMedia: 0
        };
        console.log('Dados enviados:', usuarioData);
         // Chama a API
            await axios.post('http://localhost:8080/usuarios', usuarioData);

         // Limpa o formulário
            resetForm();

        // await api.post('/usuarios', usuarioData);
        navigate('/login');
      } catch (error) {
        console.error('Erro no cadastro:', error);
        setError(error.response?.data?.message || 'Erro ao cadastrar usuário');
      } finally {
        setSubmitting(false);
      }
    };



  return (
    <Box sx={{
      maxWidth: 800,
      margin: 'auto',
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '80vh' // Adiciona altura mínima para melhor centralização
    }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Cadastro de Usuário
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%'
      }}>
        <Formik
          initialValues={{
            nome: '',
            email: '',
            senha: '',
            telefone: '',
            endereco: '',
            ofereceServico: false,
            especialidade: '',
            descricaoServico: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '100%'
            }}>
              {/* Dados Básicos */}
              <Field
                as={TextField}
                name="nome"
                label="Nome Completo"
                fullWidth
                error={touched.nome && !!errors.nome}
                helperText={touched.nome && errors.nome}
              />

              <Field
                as={TextField}
                name="email"
                label="Email"
                type="email"
                fullWidth
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />

              <Field
                as={TextField}
                name="senha"
                label="Senha"
                type="password"
                fullWidth
                error={touched.senha && !!errors.senha}
                helperText={touched.senha && errors.senha}
              />

              <Field
                as={TextField}
                name="telefone"
                label="Telefone"
                fullWidth
                error={touched.telefone && !!errors.telefone}
                helperText={touched.telefone && errors.telefone}
              />

              <Field
                as={TextField}
                name="endereco"
                label="Endereço Completo"
                fullWidth
                error={touched.endereco && !!errors.endereco}
                helperText={touched.endereco && errors.endereco}
              />


              {/* Oferece Serviço */}
             <FormControlLabel
               control={
                 <Checkbox
                   name="ofereceServico"
                   checked={values.ofereceServico}
                   onChange={(e) => {
                     handleChange(e);
                   }}
                 />
               }
               label="Ofereço serviços de cuidado"
             />


              {/* Campos condicionais para prestadores de serviço */}
              {values.ofereceServico && (
                <>
                  <FormControl fullWidth>
                    <InputLabel>Especialidade</InputLabel>
                      <Field
                        as={Select}
                        name="especialidade"
                        label="Especialidade"
                        error={touched.especialidade && !!errors.especialidade}
                        onChange={handleChange}
                        value={values.especialidade}
                        >
                        {Object.entries(Especialidade).map(([key, value]) => (
                          <MenuItem key={value} value={value}>
                            {key.toLowerCase().replace(/_/g, ' ')}
                          </MenuItem>
                        ))}
                      </Field>
                  </FormControl>

                  <Field
                    as={TextField}
                    name="descricaoServico"
                    label="Descrição do Serviço"
                    multiline
                    rows={4}
                    fullWidth
                    error={touched.descricaoServico && !!errors.descricaoServico}
                    helperText={touched.descricaoServico && errors.descricaoServico}
                  />
                </>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                Cadastrar
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default CadastroUsuario;