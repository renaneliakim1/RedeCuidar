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
  Box,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getServicos } from '../services/servicoService';

const ListaServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [mostrarDisponiveis, setMostrarDisponiveis] = useState(false);

  useEffect(() => {
     const fetchServicos = async () => {
       try {
         const data = await getServicosDisponiveis();
         setServicos(data);
       } catch (error) {
         console.error('Erro ao carregar serviços:', error);
       }
     };

    fetchServicos();
     }, []);


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {mostrarDisponiveis ? 'Serviços Disponíveis' : 'Todos os Serviços'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => setMostrarDisponiveis(!mostrarDisponiveis)}
        >
          {mostrarDisponiveis ? 'Mostrar Todos' : 'Mostrar Apenas Disponíveis'}
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to="/servicos/novo"
        >
          Novo Serviço
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Prestador</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicos.map((servico) => (
              <TableRow key={servico.id}>
                <TableCell>{servico.titulo}</TableCell>
                <TableCell>
                  <Chip
                    label={servico.categoria.replace(/_/g, ' ')}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>{servico.prestador.nome}</TableCell>
                <TableCell>
                  {servico.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </TableCell>
                <TableCell>
                  <Chip
                    label={servico.disponivel ? 'Disponível' : 'Indisponível'}
                    color={servico.disponivel ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/servicos/${servico.id}`}
                    size="small"
                  >
                    Detalhes
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

export default ListaServicos;