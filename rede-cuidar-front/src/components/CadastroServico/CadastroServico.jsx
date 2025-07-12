import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Box,
  Autocomplete,
  useTheme
} from '@mui/material';
import { createServico } from '../../services/servicoService';
import { getPrestadores } from '../../services/usuarioService';

const categoriasOptions = [
  { value: 'CUIDADOS_PESSOAIS', label: 'Cuidados Pessoais' },
  { value: 'SAUDE_MENTAL', label: 'Saúde Mental' },
  { value: 'SAUDE_FISICA', label: 'Saúde Física' },
  { value: 'EDUCACAO', label: 'Educação' },
  { value: 'OUTROS', label: 'Outros' },
];

const validationSchema = Yup.object().shape({
  titulo: Yup.string().required('Título é obrigatório'),
  descricao: Yup.string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .required('Descrição é obrigatória'),
  categoria: Yup.string().required('Categoria é obrigatória'),
  preco: Yup.number()
    .min(0, 'Preço não pode ser negativo')
    .required('Preço é obrigatório'),
  disponivel: Yup.boolean().required('Disponibilidade é obrigatória'),
  prestadorId: Yup.number().required('Prestador é obrigatório'),
});

const CadastroServico = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [prestadores, setPrestadores] = useState([]);

  useEffect(() => {
    const fetchPrestadores = async () => {
      try {
        const response = await getPrestadores();
        setPrestadores(response.data);
      } catch (error) {
        console.error('Erro ao buscar prestadores:', error);
      }
    };

    fetchPrestadores();
  }, []);

  const fieldStyle = {
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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await createServico(values);
      navigate('/servicos');
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Serviço
      </Typography>
      <Formik
        initialValues={{
          titulo: '',
          descricao: '',
          categoria: '',
          preco: '',
          disponivel: true,
          prestadorId: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="titulo"
                  label="Título do Serviço"
                  fullWidth
                  sx={fieldStyle}
                  error={touched.titulo && !!errors.titulo}
                  helperText={touched.titulo && errors.titulo}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="descricao"
                  label="Descrição"
                  multiline
                  rows={4}
                  fullWidth
                  sx={fieldStyle}
                  error={touched.descricao && !!errors.descricao}
                  helperText={touched.descricao && errors.descricao}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={touched.categoria && !!errors.categoria}>
                  <InputLabel id="categoria-label" sx={{ color: theme.palette.mode === 'dark' ? '#bbb' : undefined }}>
                    Categoria
                  </InputLabel>
                  <Select
                    labelId="categoria-label"
                    name="categoria"
                    label="Categoria"
                    value={values.categoria}
                    onChange={(e) => setFieldValue('categoria', e.target.value)}
                    sx={fieldStyle}
                  >
                    <MenuItem value="">
                      <em>Selecione</em>
                    </MenuItem>
                    {categoriasOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.categoria && errors.categoria && (
                    <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                      {errors.categoria}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="preco"
                  label="Preço"
                  type="number"
                  fullWidth
                  sx={fieldStyle}
                  error={touched.preco && !!errors.preco}
                  helperText={touched.preco && errors.preco}
                  inputProps={{ min: 0, step: '0.01' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={touched.disponivel && !!errors.disponivel}>
                  <InputLabel id="disponivel-label" sx={{ color: theme.palette.mode === 'dark' ? '#bbb' : undefined }}>
                    Disponível
                  </InputLabel>
                  <Select
                    labelId="disponivel-label"
                    name="disponivel"
                    label="Disponível"
                    value={values.disponivel}
                    onChange={(e) => setFieldValue('disponivel', e.target.value === 'true')}
                    sx={fieldStyle}
                  >
                    <MenuItem value="true">Sim</MenuItem>
                    <MenuItem value="false">Não</MenuItem>
                  </Select>
                  {touched.disponivel && errors.disponivel && (
                    <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                      {errors.disponivel}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={prestadores}
                  getOptionLabel={(option) => option.nome || ''}
                  onChange={(_, value) => setFieldValue('prestadorId', value?.id || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Prestador"
                      fullWidth
                      sx={fieldStyle}
                      error={touched.prestadorId && !!errors.prestadorId}
                      helperText={touched.prestadorId && errors.prestadorId}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' }
                  }}
                >
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar Serviço'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CadastroServico;
