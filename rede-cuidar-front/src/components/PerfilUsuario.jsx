import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Avatar, CircularProgress, Alert } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';


const formatarEspecialidade = (valor) => {
  if (!valor) return 'Não informado';
  return valor
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const PerfilUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`http://localhost:8080/usuarios/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar usuário');
        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        setErro('Erro ao carregar perfil do usuário.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (erro) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error">{erro}</Alert>
        <Box mt={2}>
          <Button variant="contained" component={Link} to="/servicos">
            Voltar
          </Button>
        </Box>
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="info">Usuário não encontrado.</Alert>
        <Box mt={2}>
          <Button variant="contained" component={Link} to="/servicos">
            Voltar
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Perfil do Usuário
      </Typography>

      <Box display="flex" justifyContent="center" mb={3}>
        <Avatar
          src={
            usuario.fotoPerfil
              ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}`
              : undefined
          }
          alt={usuario.nome}
          sx={{ width: 150, height: 150 }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1"><strong>Nome:</strong> {usuario.nome}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {usuario.email}</Typography>
        <Typography variant="body1"><strong>Telefone:</strong> {usuario.telefone || '-'}</Typography>
        <Typography variant="body1"><strong>CEP:</strong> {usuario.cep || '-'}</Typography>
        <Typography variant="body1"><strong>Bairro:</strong> {usuario.bairro || '-'}</Typography>
        <Typography variant="body1"><strong>Cidade:</strong> {usuario.cidade || '-'}</Typography>
        <Typography variant="body1"><strong>Estado:</strong> {usuario.estado || '-'}</Typography>
        <Typography variant="body1">
          <strong>Especialidade:</strong> {formatarEspecialidade(usuario.especialidade)}
        </Typography>
        <Typography variant="body1">
          <strong>Descrição do Serviço:</strong> {usuario.descricaoServico || 'Sem descrição'}
        </Typography>
      </Box>

      <Box textAlign="center" mt={3} display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" component={Link} to="/servicos">
          Voltar
        </Button>
        {usuario.telefone && (
          <Button
            variant="outlined"
            color="success"
            startIcon={<WhatsAppIcon />}
            href={`https://wa.me/55${usuario.telefone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </Button>
        )}
      </Box>

    </Container>
  );
};

export default PerfilUsuario;
