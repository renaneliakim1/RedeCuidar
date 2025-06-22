import { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  Button, Container, Box, Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListaServicos = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get("http://localhost:8080/usuarios/oferecendo-servicos");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários com serviços:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const abrirWhatsapp = (telefone) => {
    const numero = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${numero}`, '_blank');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        Profissionais disponíveis
      </Typography>

      <TableContainer component={Paper}>
        <Table>
         <TableHead>
           <TableRow>
             <TableCell>Nome</TableCell>
             <TableCell>Email</TableCell>
             <TableCell>Telefone</TableCell>
             <TableCell>Localidade</TableCell> {/* 🔄 Renomeado */}
             <TableCell>Especialidade</TableCell>
             <TableCell>Descrição</TableCell>
             <TableCell>Ações</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {usuarios.map((usuario) => {
             const localidade = `${usuario.bairro || ''}, ${usuario.cidade || ''} - ${usuario.estado || ''}`;

             return (
               <TableRow key={usuario.id}>
                 <TableCell>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <Avatar
                       alt={usuario.nome}
                       src={
                         usuario.fotoPerfil
                           ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}`
                           : ''
                       }
                     />
                     {usuario.nome}
                   </Box>
                 </TableCell>
                 <TableCell>{usuario.email}</TableCell>
                 <TableCell>{usuario.telefone}</TableCell>
                 <TableCell>{localidade}</TableCell> {/* ✅ Mostrando localidade formatada */}
                 <TableCell>{usuario.especialidade}</TableCell>
                 <TableCell>{usuario.descricaoServico || 'Sem descrição'}</TableCell>
                 <TableCell>
                   <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                     <Button
                       size="small"
                       variant="contained"
                       sx={{
                         mb: 1,
                         backgroundColor: '#25D366',
                         color: 'white',
                         '&:hover': { backgroundColor: '#1ebe57' }
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
                         color: 'white',
                         '&:hover': { backgroundColor: '#155a9c' }
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
           })}
         </TableBody>

        </Table>
      </TableContainer>
    </Container>
  );
};

export default ListaServicos;
