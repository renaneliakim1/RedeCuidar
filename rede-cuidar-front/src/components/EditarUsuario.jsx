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
  Alert,
  Avatar
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getUsuario, updateUsuario } from '../services/usuarioService';

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

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
    cep: Yup.string().required('CEP é obrigatório').length(8, 'CEP deve ter 8 dígitos'),
    bairro: Yup.string().required('Bairro é obrigatório'),
    cidade: Yup.string().required('Cidade é obrigatória'),
    estado: Yup.string().required('Estado é obrigatório'),

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
        if (data.fotoPerfil) {
          setPreview(`http://localhost:8080/uploads/fotos-perfil/${data.fotoPerfil}`);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      // Dados JSON do usuário (exceto a foto)
      const usuarioData = {
        nome: values.nome,
        email: values.email,
        telefone: values.telefone,
        endereco: values.endereco,
        ofereceServico: values.ofereceServico,
        especialidade: values.ofereceServico ? values.especialidade : null,
        descricaoServico: values.ofereceServico ? values.descricaoServico : null,
        gruposVulneraveis: values.gruposVulneraveis || [],
      };

      formData.append('usuario', new Blob([JSON.stringify(usuarioData)], { type: 'application/json' }));

      // Se o usuário escolheu nova foto, anexa ao formData
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
          cep: usuario.cep || '',
          bairro: usuario.bairro || '',
          cidade: usuario.cidade || '',
          estado: usuario.estado || '',
          ofereceServico: usuario.ofereceServico,
          especialidade: usuario.especialidade || '',
          descricaoServico: usuario.descricaoServico || '',
          gruposVulneraveis: usuario.gruposVulneraveis || [],
          fotoPerfil: null,
        }}

        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {/* Campos textuais */}
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
                  disabled
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
             </Grid>

             <Grid item xs={12} sm={6}>
               <Field
                 as={TextField}
                 name="bairro"
                 label="Bairro"
                 fullWidth
                 error={touched.bairro && !!errors.bairro}
                 helperText={touched.bairro && errors.bairro}
               />
             </Grid>

             <Grid item xs={12} sm={6}>
               <Field
                 as={TextField}
                 name="cidade"
                 label="Cidade"
                 fullWidth
                 error={touched.cidade && !!errors.cidade}
                 helperText={touched.cidade && errors.cidade}
               />
             </Grid>

             <Grid item xs={12} sm={6}>
               <Field
                 as={TextField}
                 name="estado"
                 label="Estado"
                 fullWidth
                 error={touched.estado && !!errors.estado}
                 helperText={touched.estado && errors.estado}
               />
             </Grid>

             <Grid item xs={12}>
               <Field
                 as={TextField}
                 name="endereco"
                 label="Endereço Completo"
                 fullWidth
                 error={touched.endereco && !!errors.endereco}
                 helperText={touched.endereco && errors.endereco}
               />
             </Grid>


              {/* Grupos vulneráveis */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Grupos Vulneráveis</InputLabel>
                  <Field
                    as={Select}
                    name="gruposVulneraveis"
                    multiple
                    label="Grupos Vulneráveis"
                    renderValue={(selected) =>
                      selected
                        .map((value) => gruposOptions.find((opt) => opt.value === value)?.label)
                        .join(', ')
                    }
                  >
                    {gruposOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              {/* Checkbox oferece serviço */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Field as={Checkbox} name="ofereceServico" type="checkbox" />}
                  label="Oferece serviço?"
                />
              </Grid>

              {/* Especialidade e descrição */}
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
                      <ErrorMessage name="especialidade" component="div" style={{ color: 'red' }} />
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

              {/* Foto de perfil atual e upload nova */}
              <Grid item xs={12}>
                <Typography>Foto de Perfil Atual:</Typography>
                <Box sx={{ mb: 2 }}>
                  <Avatar alt={usuario.nome} src={preview} sx={{ width: 80, height: 80 }} />
                </Box>

                <Button
                  variant="contained"
                  component="label"
                >
                  Alterar Foto
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue('fotoPerfil', file);
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      } else {
                        setPreview(usuario.fotoPerfil ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}` : null);
                      }
                    }}
                  />
                </Button>
              </Grid>


              {/* Botões */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button type="submit" variant="contained" color="primary">
                    Salvar Alterações
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/usuarios')}>
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
