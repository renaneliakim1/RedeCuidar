import React, { useEffect, useState } from 'react';
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
  Alert,
  Avatar,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getUsuario, updateUsuario } from '../../services/usuarioService';

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
  { value: 'MASSAGISTA', label: 'Massagista' },
  { value: 'PSICOLOGO', label: 'Psicólogo' },
  { value: 'NUTRICIONISTA', label: 'Nutricionista' },
  { value: 'OUTRO', label: 'Outro' },
];

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  telefone: Yup.string().required('Telefone é obrigatório'),
  endereco: Yup.string().required('Endereço é obrigatório'),
  cep: Yup.string().required('CEP é obrigatório').length(8, 'CEP deve ter 8 dígitos'),
  bairro: Yup.string().required('Bairro é obrigatório'),
  cidade: Yup.string().required('Cidade é obrigatória'),
  estado: Yup.string().required('Estado é obrigatório'),
  especialidade: Yup.string().when('ofereceServico', {
    is: true,
    then: Yup.string().required('Especialidade é obrigatória para prestadores'),
    otherwise: Yup.string().nullable(),
  }),
  descricaoServico: Yup.string().when('ofereceServico', {
    is: true,
    then: Yup.string().required('Descrição do serviço é obrigatória'),
    otherwise: Yup.string().nullable(),
  }),
});

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await getUsuario(id);
        setUsuario(data);
        if (data.fotoPerfil) {
          setPreview(`http://localhost:8080/uploads/fotos-perfil/${data.fotoPerfil}`);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        setError('Erro ao carregar usuário');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      const usuarioData = {
        nome: values.nome,
        email: values.email,
        telefone: values.telefone,
        endereco: values.endereco,
        cep: values.cep,
        bairro: values.bairro,
        cidade: values.cidade,
        estado: values.estado,
        ofereceServico: values.ofereceServico,
        especialidade: values.ofereceServico ? values.especialidade : null,
        descricaoServico: values.ofereceServico ? values.descricaoServico : null,
        gruposVulneraveis: values.gruposVulneraveis || [],
      };

      formData.append('usuario', new Blob([JSON.stringify(usuarioData)], { type: 'application/json' }));

      if (values.fotoPerfil instanceof File) {
        formData.append('foto', values.fotoPerfil);
      }

      await updateUsuario(id, formData);
      navigate('/usuarios');
    } catch (err) {
      setError('Erro ao atualizar usuário');
      console.error(err);
    } finally {
      setSubmitting(false);
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
      <Typography variant="h4" gutterBottom>
        Editar Usuário
      </Typography>

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
          cep: usuario.cep,
          bairro: usuario.bairro,
          cidade: usuario.cidade,
          estado: usuario.estado,
          ofereceServico: usuario.ofereceServico || false,
          especialidade: usuario.especialidade || '',
          descricaoServico: usuario.descricaoServico || '',
          gruposVulneraveis: usuario.gruposVulneraveis || [],
          fotoPerfil: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Nome"
                  name="nome"
                  variant="outlined"
                  helperText={<ErrorMessage name="nome" />}
                  error={Boolean(values.nome === '' && 'nome')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  helperText={<ErrorMessage name="email" />}
                  error={Boolean(values.email === '' && 'email')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  variant="outlined"
                  helperText={<ErrorMessage name="telefone" />}
                  error={Boolean(values.telefone === '' && 'telefone')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="CEP"
                  name="cep"
                  variant="outlined"
                  helperText={<ErrorMessage name="cep" />}
                  error={Boolean(values.cep === '' && 'cep')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Bairro"
                  name="bairro"
                  variant="outlined"
                  helperText={<ErrorMessage name="bairro" />}
                  error={Boolean(values.bairro === '' && 'bairro')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Cidade"
                  name="cidade"
                  variant="outlined"
                  helperText={<ErrorMessage name="cidade" />}
                  error={Boolean(values.cidade === '' && 'cidade')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Estado"
                  name="estado"
                  variant="outlined"
                  helperText={<ErrorMessage name="estado" />}
                  error={Boolean(values.estado === '' && 'estado')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Endereço"
                  name="endereco"
                  variant="outlined"
                  helperText={<ErrorMessage name="endereco" />}
                  error={Boolean(values.endereco === '' && 'endereco')}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.ofereceServico}
                      onChange={() => setFieldValue('ofereceServico', !values.ofereceServico)}
                    />
                  }
                  label="Oferece serviços"
                />
              </Grid>

              {values.ofereceServico && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="especialidade-label">Especialidade</InputLabel>
                      <Select
                        labelId="especialidade-label"
                        label="Especialidade"
                        name="especialidade"
                        value={values.especialidade}
                        onChange={(e) => setFieldValue('especialidade', e.target.value)}
                      >
                        {especialidadesOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <ErrorMessage
                      name="especialidade"
                      component="div"
                      style={{ color: 'red', fontSize: 12 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      multiline
                      rows={4}
                      label="Descrição do Serviço"
                      name="descricaoServico"
                      variant="outlined"
                      helperText={<ErrorMessage name="descricaoServico" />}
                      error={Boolean(values.descricaoServico === '' && 'descricaoServico')}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={6}>
                <Button variant="contained" component="label">
                  Upload Foto de Perfil
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      setFieldValue('fotoPerfil', file);
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                {preview && (
                  <Avatar
                    src={preview}
                    alt="Preview da foto"
                    sx={{ width: 100, height: 100 }}
                    variant="rounded"
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
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
