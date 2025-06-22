import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import axios from 'axios';

const PerfilUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/usuarios/${id}`);
        setUsuario(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setErro('Erro ao carregar perfil do usuário.');
      }
    };
    fetchUsuario();
  }, [id]);

  const formatarEspecialidade = (valor) => {
    if (!valor) return 'Não informado';
    return valor.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (erro) {
    return <Container><Typography color="error">{erro}</Typography></Container>;
  }

  if (!usuario) {
    return <Container><Typography>Carregando perfil...</Typography></Container>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Perfil do Usuário</Typography>

      {usuario.fotoPerfil && (
        <img
          src={`http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}`}
          alt="Foto de perfil"
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1rem'
          }}
        />
      )}

      <Box sx={{ mb: 2 }}>
        <Typography><strong>Nome:</strong> {usuario.nome}</Typography>
        <Typography><strong>Email:</strong> {usuario.email}</Typography>
        <Typography><strong>Telefone:</strong> {usuario.telefone}</Typography>
        <Typography><strong>CEP:</strong> {usuario.cep}</Typography>
        <Typography><strong>Bairro:</strong> {usuario.bairro}</Typography>
        <Typography><strong>Cidade:</strong> {usuario.cidade}</Typography>
        <Typography><strong>Estado:</strong> {usuario.estado}</Typography>
        <Typography><strong>Endereço:</strong> {usuario.endereco}</Typography>
        <Typography><strong>Especialidade:</strong> {formatarEspecialidade(usuario.especialidade)}</Typography>
        <Typography><strong>Descrição do Serviço:</strong> {usuario.descricaoServico || 'Sem descrição'}</Typography>
      </Box>

      <Button variant="contained" component={Link} to="/servicos">
        Voltar
      </Button>
    </Container>
  );
};

export default PerfilUsuario;
