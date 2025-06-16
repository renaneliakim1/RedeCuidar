import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
/*import { getUsuario, updateUsuario } from '../services/usuarioService';*/
 import { getUsuario, updateUsuario } from '../services/usuarioService';



const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const gruposOptions = [
    { value: 'MULHER', label: 'Mulher' },
    { value: 'PCD', label: 'Pessoa com Deficiência' },
    { value: 'INDIGENA', label: 'Indígena' },
    { value: 'LGBTQIA+', label: 'LGBTQIA+' },
    { value: 'REFUGIADO', label: 'Refugiado' },
    { value: 'IDOSO', label: 'Idoso' },
    { value: 'OUTRO', label: 'Outro' },
  ];

  const especialidadesOptions = [
    { value: 'CUIDADOR', label: 'Cuidador' },
    { value: 'BABA', label: 'Babá' },
    { value: 'ENFERMEIRO', label: 'Enfermeiro' },
    { value: 'FISIOTERAPEUTA', label: 'Fisioterapeuta' },
    { value: 'MEDICO', label: 'Médico' },
    { value: 'PSICOLOGO', label: 'Psicólogo' },
    { value: 'NUTRICIONISTA', label: 'Nutricionista' },
    { value: 'OUTRO', label: 'Outro' },
  ];

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    telefone: Yup.string().required('Telefone é obrigatório'),
    endereco: Yup.string().required('Endereço é obrigatório'),
    especialidade: Yup.string().when('ofereceServico', {
      is: true,
      then: Yup.string().required('Especialidade é obrigatória para prestadores'),
    }),
    descricaoServico: Yup.string().when('ofereceServico', {
      is: true,
      then: Yup.string().required('Descrição do serviço é obrigatória'),
    }),
  });

  useEffect(() => {
      const fetchUsuario = async () => {
        try {
          const data = await getUsuario(id);
          setUsuario(data);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
        }
      };

      fetchUsuario();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await updateUsuario(id, values);
      navigate('/usuarios');
    } catch (err) {
      setError('Erro ao atualizar usuário');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!usuario) {
    return (
      <Box p={3}>
        <Alert severity="error">Usuário não encontrado</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Editar Usuário</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          endereco: usuario.endereco,
          ofereceServico: usuario.ofereceServico,
          especialidade: usuario.especialidade || '',
          descricaoServico: usuario.descricaoServico || '',
          gruposVulneraveis: usuario.gruposVulneraveis || []
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="nome"
                  label="Nome Completo"
                  fullWidth
                  error={touched.nome && !!errors.nome}
                  helperText={touched.nome && errors.nome}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="telefone"
                  label="Telefone"
                  fullWidth
                  error={touched.telefone && !!errors.telefone}
                  helperText={touched.telefone && errors.telefone}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="endereco"
                  label="Endereço"
                  fullWidth
                  error={touched.endereco && !!errors.endereco}
                  helperText={touched.endereco && errors.endereco}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Grupos Vulneráveis</InputLabel>
                  <Field
                    as={Select}
                    name="gruposVulneraveis"
                    multiple
                    label="Grupos Vulneráveis"
                    renderValue={(selected) => selected.map(value =>
                      gruposOptions.find(opt => opt.value === value).label).join(', ')}
                  >
                    {gruposOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Field
                      as={Checkbox}
                      name="ofereceServico"
                      type="checkbox"
                    />
                  }
                  label="Oferece serviço?"
                />
              </Grid>
              {values.ofereceServico && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Especialidade</InputLabel>
                      <Field
                        as={Select}
                        name="especialidade"
                        label="Especialidade"
                        error={touched.especialidade && !!errors.especialidade}
                      >
                        {especialidadesOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="especialidade" component="div" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Salvar Alterações
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/usuarios')}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditarUsuario;