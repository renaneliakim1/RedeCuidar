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

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



const CadastroUsuario = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


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

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: Yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
    telefone: Yup.string().required('Telefone é obrigatório'),
    cep: Yup.string().required('CEP é obrigatório').length(8, 'CEP inválido'),
    bairro: Yup.string().required('Bairro é obrigatório'),
    cidade: Yup.string().required('Cidade é obrigatória'),
    estado: Yup.string().required('Estado é obrigatório'),
    ofereceServico: Yup.boolean().default(false),
    especialidade: Yup.string().when('ofereceServico', {
      is: true,
      then: (schema) => schema.required('Especialidade é obrigatória'),
      otherwise: (schema) => schema.notRequired()
    }),
    descricaoServico: Yup.string().when('ofereceServico', {
      is: true,
      then: (schema) => schema.required('Descrição é obrigatória'),
      otherwise: (schema) => schema.notRequired()
    }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      const usuarioData = {
        nome: values.nome,
        email: values.email,
        senha: values.senha,
        telefone: values.telefone,


        cep: values.cep,
        bairro: values.bairro,
        cidade: values.cidade,
        estado: values.estado,
        ofereceServico: values.ofereceServico,
        especialidade: values.ofereceServico ? values.especialidade : null,
        descricaoServico: values.ofereceServico ? values.descricaoServico : null
      };

      formData.append("usuario", new Blob([JSON.stringify(usuarioData)], { type: "application/json" }));

      if (values.fotoPerfil) {
        formData.append("foto", values.fotoPerfil);
      }

      await axios.post("http://localhost:8080/usuarios", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro!", error);
      setError(error.response?.data?.message || "Erro ao cadastrar usuário");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3, minHeight: '80vh' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Cadastro de Usuário
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Formik
        initialValues={{
          nome: '',
          email: '',
          senha: '',
          telefone: '',
          cep: '',
          bairro: '',
          cidade: '',
          estado: '',
          ofereceServico: false,
          especialidade: '',
          descricaoServico: '',
          fotoPerfil: null
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Field as={TextField} name="nome" label="Nome Completo" fullWidth error={touched.nome && !!errors.nome} helperText={touched.nome && errors.nome} />
            <Field as={TextField} name="email" label="Email" type="email" fullWidth error={touched.email && !!errors.email} helperText={touched.email && errors.email} />

            <Field
              as={TextField}
              name="senha"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              fullWidth
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






            <Field as={TextField} name="telefone" label="Telefone" fullWidth error={touched.telefone && !!errors.telefone} helperText={touched.telefone && errors.telefone} />

         {/*    <Field
              as={TextField}
              name="endereco"
              label="Endereço"
              fullWidth
              error={touched.endereco && !!errors.endereco}
              helperText={touched.endereco && errors.endereco}
            /> */}


            <Field
              as={TextField}
              name="cep"
              label="CEP"
              fullWidth
              error={touched.cep && !!errors.cep}
              helperText={touched.cep && errors.cep}
              onChange={(e) => {
                const cep = e.target.value.replace(/\D/g, '');
                setFieldValue('cep', cep);
                if (cep.length === 8) {
                  fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(res => res.json())
                    .then(data => {
                      if (!data.erro) {
                        setFieldValue('bairro', data.bairro);
                        setFieldValue('cidade', data.localidade);
                        setFieldValue('estado', data.uf);
                      }
                    });
                }
              }}
            />

            <Field as={TextField} name="bairro" label="Bairro" fullWidth error={touched.bairro && !!errors.bairro} helperText={touched.bairro && errors.bairro} />
            <Field as={TextField} name="cidade" label="Cidade" fullWidth error={touched.cidade && !!errors.cidade} helperText={touched.cidade && errors.cidade} />
            <Field as={TextField} name="estado" label="Estado" fullWidth error={touched.estado && !!errors.estado} helperText={touched.estado && errors.estado} />


            <input
              type="file"
              name="fotoPerfil"
              accept="image/*"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                setFieldValue("fotoPerfil", file);
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="ofereceServico"
                  checked={values.ofereceServico}
                  onChange={handleChange}
                />
              }
              label="Ofereço serviços de cuidado"
            />

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

            <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2 }}>
              Cadastrar
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CadastroUsuario;
