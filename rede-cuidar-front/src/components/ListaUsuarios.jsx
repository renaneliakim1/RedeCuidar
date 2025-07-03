import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarPrestadores, setMostrarPrestadores] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      setErro('');
      try {
        const url = mostrarPrestadores
          ? 'http://localhost:8080/usuarios/prestadores' // ajuste conforme endpoint correto
          : 'http://localhost:8080/usuarios';
        const response = await axios.get(url);
        setUsuarios(response.data);
      } catch (error) {
        setErro('Erro ao buscar usuários.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [mostrarPrestadores]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {mostrarPrestadores ? 'Prestadores de Serviço' : 'Todos os Usuários'}
      </Typography>

      <Button
        variant="contained"
        onClick={() => setMostrarPrestadores(!mostrarPrestadores)}
        sx={{ mb: 3 }}
      >
        {mostrarPrestadores ? 'Mostrar Todos' : 'Mostrar Apenas Prestadores'}
      </Button>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : erro ? (
        <Alert severity="error">{erro}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.ofereceServico ? 'Prestador' : 'Usuário'}</TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        to={`/usuarios/${usuario.id}`}
                        size="small"
                        variant="outlined"
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ListaUsuarios;
