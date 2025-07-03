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
} from '@mui/material';
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
      if (file.size > 5 * 1024 * 1024) { // 5MB
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
      });

      setUsuario(response.data);
      setEditando(false);
      setNovaFoto(null);
      setPreviewFoto(null);
      setErro('');
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data === 'string' &&
        error.response.data.includes('Maximum upload size exceeded')
      ) {
        setErro('A imagem excede o tamanho máximo permitido (5MB).');
      } else {
        setErro('Erro! Imagem maior que 5 mb.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async () => {
    if (!window.confirm('Tem certeza que deseja excluir seu perfil?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/usuarios/${usuario.id}`);
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
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Perfil do Usuário
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Avatar
          src={previewFoto || (usuario.fotoPerfil ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}` : '')}
          alt={usuario.nome}
          sx={{ width: 150, height: 150 }}
        />
      </Box>

      {editando ? (
        <Box component="form" onSubmit={handleSalvar} noValidate>
          {erro && (
            <Typography color="error" sx={{ mb: 2 }}>
              {erro}
            </Typography>
          )}

          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            Alterar Foto
            <input hidden accept="image/*" type="file" onChange={handleFotoChange} />
          </Button>

          <TextField label="Nome" fullWidth margin="normal" value={formData.nome || ''} onChange={handleInputChange('nome')} required />
          <TextField label="Email" fullWidth margin="normal" value={formData.email || ''} disabled />
          <TextField label="Telefone" fullWidth margin="normal" value={formData.telefone || ''} onChange={handleInputChange('telefone')} />
          <TextField label="CEP" fullWidth margin="normal" value={formData.cep || ''} onChange={(e) => {
            const cep = e.target.value.replace(/\D/g, '');
            setFormData({ ...formData, cep });
            if (cep.length === 8) buscarEnderecoViaCep(cep);
          }} />
          <TextField label="Bairro" fullWidth margin="normal" value={formData.bairro || ''} onChange={handleInputChange('bairro')} />
          <TextField label="Cidade" fullWidth margin="normal" value={formData.cidade || ''} onChange={handleInputChange('cidade')} />
          <TextField label="Estado" fullWidth margin="normal" value={formData.estado || ''} onChange={handleInputChange('estado')} />

          <FormControlLabel
            control={<Checkbox checked={formData.ofereceServico || false} onChange={handleInputChange('ofereceServico')} />}
            label="Oferece serviços?"
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
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              Salvar
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
            >
              Cancelar
            </Button>
          </Stack>
        </Box>
      ) : (
        <>
          <Typography><strong>Nome:</strong> {usuario.nome}</Typography>
          <Typography><strong>Email:</strong> {usuario.email}</Typography>
          <Typography><strong>Telefone:</strong> {usuario.telefone}</Typography>
          <Typography><strong>CEP:</strong> {usuario.cep}</Typography>
          <Typography><strong>Bairro:</strong> {usuario.bairro}</Typography>
          <Typography><strong>Cidade:</strong> {usuario.cidade}</Typography>
          <Typography><strong>Estado:</strong> {usuario.estado}</Typography>

          {usuario.ofereceServico && (
            <>
              <Typography><strong>Especialidade:</strong> {Especialidade[usuario.especialidade]}</Typography>
              <Typography><strong>Descrição do Serviço:</strong> {usuario.descricaoServico || 'Sem descrição'}</Typography>
            </>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => setEditando(true)}>
              Editar
            </Button>
            <Button variant="outlined" color="error" onClick={handleExcluir}>
              Excluir Perfil
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Perfil;
