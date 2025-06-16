import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
/* import { getUsuarios, getPrestadores } from '../services/usuarioService';*/
import { getUsuarios } from '../services/usuarioService';


const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarPrestadores, setMostrarPrestadores] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = mostrarPrestadores
          ? await getPrestadores()
          : await getUsuarios();
        setUsuarios(data.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuarios();
  }, [mostrarPrestadores]);

  return (
    <Box sx={{ p: 3 }}>
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
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  {usuario.ofereceServico ? 'Prestador' : 'Usuário'}
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/usuarios/${usuario.id}`}
                    size="small"
                  >
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListaUsuarios;