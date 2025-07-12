import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Stack,
  Chip,
  Divider,
  Rating,
  useTheme
} from '@mui/material';
import {
  WhatsApp,
  Email,
  Phone,
  LocationOn,
  Work,
  Star
} from '@mui/icons-material';
import axios from 'axios';

const Especialidade = {
  CUIDADOR: 'Cuidador',
  BABA: 'Babá',
  ENFERMEIRO: 'Enfermeiro',
  FISIOTERAPEUTA: 'Fisioterapeuta',
  MEDICO: 'Médico',
  PSICOLOGO: 'Psicólogo',
  NUTRICIONISTA: 'Nutricionista',
  BARBEIRO_A_DOMICILIO: 'Barbeiro(a) a domicílio',
  FAXINEIRO: 'Faxineiro',
};

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [novaFoto, setNovaFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      setErro('Usuário não está logado.');
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:8080/usuarios/perfil?email=${encodeURIComponent(email)}`)
      .then((response) => {
        setUsuario(response.data);
        setFormData(response.data);
      })
      .catch(() => setErro('Erro ao carregar perfil.'))
      .finally(() => setLoading(false));
  }, []);

  const buscarEnderecoViaCep = (cep) => {
    if (cep.length !== 8) return;
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
        }
      })
      .catch(() => console.error('Erro ao buscar endereço pelo CEP.'));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErro('A imagem deve ter no máximo 5MB.');
        return;
      }
      setNovaFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
      setErro('');
    }
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dadosUsuario = { ...formData };
      delete dadosUsuario.fotoPerfil;

      const data = new FormData();
      data.append('usuario', new Blob([JSON.stringify(dadosUsuario)], { type: 'application/json' }));
      if (novaFoto) {
        data.append('foto', novaFoto);
      }

      const response = await axios.put(`http://localhost:8080/usuarios/${usuario.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      setUsuario(response.data);
      setEditando(false);
      setNovaFoto(null);
      setPreviewFoto(null);
      setErro('');
    } catch (error) {
      if (error.response?.data?.includes('Maximum upload size exceeded')) {
        setErro('A imagem excede o tamanho máximo permitido (5MB).');
      } else {
        setErro('Erro ao atualizar perfil.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async () => {
    if (!window.confirm('Tem certeza que deseja excluir seu perfil?')) return;
    setLoading(true);
    const email = localStorage.getItem('email');
    try {
      await axios.delete('http://localhost:8080/usuarios/me', {
        data: { email },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      localStorage.clear();
      window.location.href = '/';
    } catch {
      setErro('Erro ao excluir perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (erro && !editando) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <Typography color="error">{erro}</Typography>
      </Container>
    );
  }

  if (!usuario) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'background.paper'
      }}>
        {/* Cabeçalho com foto de capa */}
        <Box sx={{
          height: 200,
          bgcolor: theme.palette.mode === 'light' ? '#e3f2fd' : '#285fb5',
          position: 'relative'
        }}>
          <Avatar
            src={previewFoto || (usuario.fotoPerfil ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}` : '')}
            alt={usuario.nome}
            sx={{
              width: 150,
              height: 150,
              border: '4px solid white',
              position: 'absolute',
              bottom: -75,
              left: 40,
            }}
          />
        </Box>

        {/* Corpo do perfil */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          p: 4,
          pt: 10,
          gap: 4
        }}>
          {/* Coluna esquerda - Informações básicas */}
          <Box sx={{ width: { md: '35%' } }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {usuario.nome}
            </Typography>

            {usuario.ofereceServico && usuario.especialidade && (
              <Chip
                label={Especialidade[usuario.especialidade] || 'Profissional'}
                color="primary"
                sx={{ mb: 3 }}
                icon={<Work />}
              />
            )}

           {/*  <Typography variant="body1" sx={{ mb: 3 }}>
              {usuario.descricaoServico || 'Descrição não informada'}
            </Typography> */}

            <Box sx={{
              bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#1e1e1e',
              p: 3,
              borderRadius: 2,
              mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Informações de Contato
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Email color="primary" sx={{ mr: 1.5 }} />
                <Typography>{usuario.email || 'Não informado'}</Typography>
              </Box>

              {usuario.telefone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Phone color="primary" sx={{ mr: 1.5 }} />
                  <Typography>{usuario.telefone}</Typography>
                </Box>
              )}

              {/* {(usuario.bairro || usuario.cidade || usuario.estado) && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <LocationOn color="primary" sx={{ mr: 1.5 }} />
                  <Typography>
                    {[usuario.bairro, usuario.cidade, usuario.estado].filter(Boolean).join(', ') || 'Não informado'}
                  </Typography>
                </Box>
              )} */}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => setEditando(true)}
                fullWidth
              >
                Editar Perfil
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={handleExcluir}
                fullWidth
              >
                Excluir Perfil
              </Button>
            </Box>
          </Box>

          {/* Coluna direita - Formulário de edição ou detalhes */}
          <Box sx={{
            width: { md: '65%' },
            borderLeft: { md: `1px solid ${theme.palette.divider}` },
            pl: { md: 4 }
          }}>
            {editando ? (
              <Box component="form" onSubmit={handleSalvar}>
                {erro && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {erro}
                  </Typography>
                )}

                <Button variant="outlined" component="label" sx={{ mb: 3 }}>
                  Alterar Foto
                  <input hidden accept="image/*" type="file" onChange={handleFotoChange} />
                </Button>

                <TextField
                  label="Nome"
                  fullWidth
                  margin="normal"
                  value={formData.nome || ''}
                  onChange={handleInputChange('nome')}
                  required
                />

                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  value={formData.email || ''}
                  disabled
                />

                <TextField
                  label="Telefone"
                  fullWidth
                  margin="normal"
                  value={formData.telefone || ''}
                  onChange={handleInputChange('telefone')}
                />

                <TextField
                  label="CEP"
                  fullWidth
                  margin="normal"
                  value={formData.cep || ''}
                  onChange={(e) => {
                    const cep = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, cep });
                    if (cep.length === 8) buscarEnderecoViaCep(cep);
                  }}
                />

                <TextField
                  label="Bairro"
                  fullWidth
                  margin="normal"
                  value={formData.bairro || ''}
                  onChange={handleInputChange('bairro')}
                />

                <TextField
                  label="Cidade"
                  fullWidth
                  margin="normal"
                  value={formData.cidade || ''}
                  onChange={handleInputChange('cidade')}
                />

                <TextField
                  label="Estado"
                  fullWidth
                  margin="normal"
                  value={formData.estado || ''}
                  onChange={handleInputChange('estado')}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.ofereceServico || false}
                      onChange={handleInputChange('ofereceServico')}
                    />
                  }
                  label="Oferece serviços?"
                  sx={{ mt: 2, mb: 2 }}
                />

                {formData.ofereceServico && (
                  <>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="especialidade-label">Especialidade</InputLabel>
                      <Select
                        labelId="especialidade-label"
                        value={formData.especialidade || ''}
                        label="Especialidade"
                        onChange={handleInputChange('especialidade')}
                      >
                        {Object.entries(Especialidade).map(([key, label]) => (
                          <MenuItem key={key} value={key}>{label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Descrição do Serviço"
                      fullWidth
                      margin="normal"
                      multiline
                      minRows={3}
                      value={formData.descricaoServico || ''}
                      onChange={handleInputChange('descricaoServico')}
                    />
                  </>
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                  >
                    Salvar Alterações
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setEditando(false);
                      setFormData(usuario);
                      setPreviewFoto(null);
                      setNovaFoto(null);
                      setErro('');
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </Box>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Detalhes do Perfil
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Informações Pessoais
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography><strong>Nome:</strong> {usuario.nome}</Typography>
                  <Typography><strong>Email:</strong> {usuario.email}</Typography>
                  {usuario.telefone && <Typography><strong>Telefone:</strong> {usuario.telefone}</Typography>}
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Endereço
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {usuario.cep && <Typography><strong>CEP:</strong> {usuario.cep}</Typography>}
                  {usuario.bairro && <Typography><strong>Bairro:</strong> {usuario.bairro}</Typography>}
                  {usuario.cidade && <Typography><strong>Cidade:</strong> {usuario.cidade}</Typography>}
                  {usuario.estado && <Typography><strong>Estado:</strong> {usuario.estado}</Typography>}
                </Box>

                {usuario.ofereceServico && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Informações Profissionais
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {usuario.especialidade && (
                      <Typography>
                        <strong>Especialidade:</strong> {Especialidade[usuario.especialidade]}
                      </Typography>
                    )}
                    {usuario.descricaoServico && (
                      <Typography sx={{ mt: 1 }}>
                        <strong>Descrição:</strong> {usuario.descricaoServico}
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Perfil;