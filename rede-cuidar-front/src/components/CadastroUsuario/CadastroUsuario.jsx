import React, { useState, useRef } from 'react';
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
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const CadastroUsuario = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const especialidades = [
    { value: 'CUIDADOR', label: 'Cuidador(a)' },
    { value: 'BABA', label: 'Babá' },
    { value: 'ENFERMEIRO', label: 'Enfermeiro(a)' },
    { value: 'FISIOTERAPEUTA', label: 'Fisioterapeuta' },
    { value: 'MASSAGISTA', label: 'Massagista' },
    { value: 'PSICOLOGO', label: 'Psicólogo(a)' },
    { value: 'NUTRICIONISTA', label: 'Nutricionista' },
    { value: 'BARBEIRO_A_DOMICILIO', label: 'Barbeiro(a) a domicílio' },
    { value: 'FAXINEIRO', label: 'Faxineiro(a)' },
  ];


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
      then: (schema) => schema
          .required('Descrição é obrigatória')
          .min(40, 'A descrição deve ter no mínimo 40 caracteres'),
      otherwise: (schema) => schema.notRequired()
    }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setError('Por favor, confirme que você não é um robô.');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('captchaToken', captchaToken);

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
      recaptchaRef.current?.reset();
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" textAlign="center" gutterBottom fontWeight={600}>
          Cadastro
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
            <Form>
              <Typography variant="h6" gutterBottom>Dados Pessoais</Typography>
              <Divider sx={{ mb: 2 }} />

              <Field as={TextField} name="nome" label="Nome Completo" fullWidth margin="normal" error={touched.nome && !!errors.nome} helperText={touched.nome && errors.nome} />
              <Field as={TextField} name="email" label="Email" type="email" fullWidth margin="normal" error={touched.email && !!errors.email} helperText={touched.email && errors.email} />

              <Field
                as={TextField}
                name="senha"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                error={touched.senha && !!errors.senha}
                helperText={touched.senha && errors.senha}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Field as={TextField} name="telefone" label="Telefone" fullWidth margin="normal" error={touched.telefone && !!errors.telefone} helperText={touched.telefone && errors.telefone} />

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Endereço</Typography>
              <Divider sx={{ mb: 2 }} />

              <Field
                as={TextField}
                name="cep"
                label="CEP"
                fullWidth
                margin="normal"
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

              <Field as={TextField} name="bairro" label="Bairro" fullWidth margin="normal" error={touched.bairro && !!errors.bairro} helperText={touched.bairro && errors.bairro} />
              <Field as={TextField} name="cidade" label="Cidade" fullWidth margin="normal" error={touched.cidade && !!errors.cidade} helperText={touched.cidade && errors.cidade} />
              <Field as={TextField} name="estado" label="Estado" fullWidth margin="normal" error={touched.estado && !!errors.estado} helperText={touched.estado && errors.estado} />

              <Box sx={{ mt: 3 }}>
                <InputLabel>Foto de Perfil</InputLabel>
                <input
                  type="file"
                  name="fotoPerfil"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    setFieldValue("fotoPerfil", file);
                  }}
                  style={{ marginTop: '8px' }}
                />
              </Box>

              <FormControlLabel
                sx={{ mt: 3 }}
                control={
                  <Checkbox
                    name="ofereceServico"
                    checked={values.ofereceServico}
                    onChange={handleChange}
                  />
                }
                label="Ofereçe serviços de cuidado? Marque aqui! "
              />

              {values.ofereceServico && (
                <>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Especialidade</InputLabel>
                    <Field
                      as={Select}
                      name="especialidade"
                      label="Especialidade"
                      value={values.especialidade}
                      onChange={handleChange}
                      error={touched.especialidade && !!errors.especialidade}
                    >
                      {especialidades.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
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
                    margin="normal"
                    error={touched.descricaoServico && !!errors.descricaoServico}
                    helperText={touched.descricaoServico && errors.descricaoServico}
                  />
                </>
              )}

              <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
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
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  }}
                >
                  Cadastrar
                </Button>



            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default CadastroUsuario;
