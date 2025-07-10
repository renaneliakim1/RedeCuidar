import { Box, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        textAlign: 'center',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 1 }}>
        <Link
          component={RouterLink}
          to="/quem-somos"
          underline="hover"
          color="inherit"
          sx={{
            fontWeight: 'normal',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              fontWeight: 'bold',
              textDecoration: 'none',
            }
          }}
        >
          Quem Somos
        </Link>

        <Link
          component={RouterLink}
          to="/fale-conosco"
          underline="hover"
          color="inherit"
          sx={{
            fontWeight: 'normal',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              fontWeight: 'bold',
              textDecoration: 'none',
            }
          }}
        >
          Fale Conosco
        </Link>
      </Box>

      <Typography variant="body1" component="p">
        © {new Date().getFullYear()} Rede Cuidar - Todos os direitos reservados
      </Typography>
    </Box>
  );
};

export default Footer;
