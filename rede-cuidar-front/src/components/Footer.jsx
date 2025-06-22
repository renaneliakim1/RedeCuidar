import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: (theme) => theme.palette.primary.contrastText
      }}
    >
      <Typography variant="body1" align="center">
        © {new Date().getFullYear()} Rede Cuidar - Todos os direitos reservados
      </Typography>
    </Box>
  );
};

export default Footer;