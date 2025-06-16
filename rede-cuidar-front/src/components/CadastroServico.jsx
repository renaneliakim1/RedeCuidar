import { useState, useEffect } from 'react';
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
  Autocomplete
} from '@mui/material';
import { createServico } from '../services/servicoService';
/* import { getPrestadores } from "../../services/usuarioService"; */
/*import { getPrestadores } from "@/services/usuarioService";
 import { getPrestadores } from "./services/usuarioService";*/
 import { getPrestadores } from "../services/usuarioService";


const CadastroServico = () => {
  const navigate = useNavigate();
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

  const handleSubmit = async (values) => {
    try {
      await createServico(values);
      navigate('/servicos');
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Cadastro de Serviço</Typography>
      <Formik
        initialValues={{
          titulo: '',
          descricao: '',
          categoria: '',
          preco: 0,
          disponivel: true,
          prestadorId: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="titulo"
                  label="Título do Serviço"
                  fullWidth
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
                  error={touched.descricao && !!errors.descricao}
                  helperText={touched.descricao && errors.descricao}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Field
                    as={Select}
                    name="categoria"
                    label="Categoria"
                    error={touched.categoria && !!errors.categoria}
                  >
                    {categoriasOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="preco"
                  label="Preço"
                  type="number"
                  fullWidth
                  error={touched.preco && !!errors.preco}
                  helperText={touched.preco && errors.preco}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Disponível</InputLabel>
                  <Field
                    as={Select}
                    name="disponivel"
                    label="Disponível"
                    error={touched.disponivel && !!errors.disponivel}
                  >
                    <MenuItem value={true}>Sim</MenuItem>
                    <MenuItem value={false}>Não</MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={prestadores}
                    getOptionLabel={(option) => option.nome}
                    onChange={(_, value) => setFieldValue('prestadorId', value?.id || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Prestador"
                        error={touched.prestadorId && !!errors.prestadorId}
                        helperText={touched.prestadorId && errors.prestadorId}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Cadastrar Serviço
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