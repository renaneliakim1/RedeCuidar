import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  Button,
  Box,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListaServicos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:8080/usuarios/oferecendo-servicos');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários com serviços:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const abrirWhatsapp = (telefone) => {
    const numero = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${numero}`, '_blank');
  };

  const filtrarUsuarios = usuarios.filter((usuario) => {
    const localidade = `${usuario.bairro || ''} ${usuario.cidade || ''} ${usuario.estado || ''}`.toLowerCase();
    const busca = termoBusca.toLowerCase();

    return (
      (usuario.nome && usuario.nome.toLowerCase().includes(busca)) ||
      (usuario.email && usuario.email.toLowerCase().includes(busca)) ||
      (usuario.telefone && usuario.telefone.toLowerCase().includes(busca)) ||
      localidade.includes(busca) ||
      (usuario.especialidade && usuario.especialidade.toLowerCase().includes(busca)) ||
      (usuario.descricaoServico && usuario.descricaoServico.toLowerCase().includes(busca))
    );
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
        Profissionais disponíveis
      </Typography>

      <TextField
        label="Buscar serviços ou profissionais"
        variant="outlined"
        fullWidth
        value={termoBusca}
        onChange={(e) => setTermoBusca(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Localidade</TableCell>
              <TableCell>Especialidade</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtrarUsuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhum profissional encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtrarUsuarios.map((usuario) => {
                const localidade = `${usuario.bairro || ''}, ${usuario.cidade || ''} - ${usuario.estado || ''}`;

                return (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          alt={usuario.nome}
                          src={
                            usuario.fotoPerfil
                              ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}`
                              : undefined
                          }
                        />
                        {usuario.nome}
                      </Box>
                    </TableCell>

                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.telefone}</TableCell>
                    <TableCell>{localidade}</TableCell>
                    <TableCell>{usuario.especialidade}</TableCell>
                    <TableCell>{usuario.descricaoServico || 'Sem descrição'}</TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: '#25D366',
                            '&:hover': { backgroundColor: '#1ebe57' },
                            color: 'white',
                          }}
                          onClick={() => abrirWhatsapp(usuario.telefone)}
                        >
                          WhatsApp
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#155a9c' },
                            color: 'white',
                          }}
                          component={Link}
                          to={`/perfil/${usuario.id}`}
                        >
                          Ver Perfil
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ListaServicos;
