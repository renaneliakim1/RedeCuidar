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

  if (erro) {
    return <Container><Typography color="error">{erro}</Typography></Container>;
  }

  if (!usuario) {
    return <Container><Typography>Carregando perfil...</Typography></Container>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Perfil do Usuário</Typography>

      <Box sx={{ mb: 2 }}>
        <Typography><strong>Nome:</strong> {usuario.nome}</Typography>
        <Typography><strong>Email:</strong> {usuario.email}</Typography>
        <Typography><strong>Telefone:</strong> {usuario.telefone}</Typography>
        <Typography><strong>Endereço:</strong> {usuario.endereco}</Typography>
        <Typography><strong>Especialidade:</strong> {usuario.especialidade || 'Não informado'}</Typography>
        <Typography><strong>Descrição do Serviço:</strong> {usuario.descricaoServico || 'Sem descrição'}</Typography>
      </Box>

      <Button variant="contained" component={Link} to="/servicos">
        Voltar
      </Button>
    </Container>
  );
};

export default PerfilUsuario;
