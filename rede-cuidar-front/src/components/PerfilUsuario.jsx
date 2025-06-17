import React from 'react';
import { Box, Typography } from '@mui/material';

const PerfilUsuario = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Perfil do Usuário</Typography>
      {/* Aqui você pode exibir dados do usuário com fetch ou localStorage */}
    </Box>
  );
};

export default PerfilUsuario;
