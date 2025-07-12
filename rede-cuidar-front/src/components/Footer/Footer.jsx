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
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 1, flexWrap: 'wrap' }}>
        <Link
          component={RouterLink}
          to="/quem-somos"
          underline="none"
          color="inherit"
          sx={{
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'color 0.3s ease, text-decoration 0.3s ease',
            '&:hover': {
              color: theme.palette.secondary.main,
              textDecoration: 'none',
              color: '#01E0CD',

            }
          }}
        >
          Quem Somos
        </Link>

        <Link
          component={RouterLink}
          to="/fale-conosco"
          underline="none"
          color="inherit"
          sx={{
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'color 0.3s ease, textDecoration 0.3s ease',
            '&:hover': {
              color: theme.palette.secondary.main,
              textDecoration: 'none',
              color: '#01E0CD',

            }
          }}
        >
          Fale Conosco
        </Link>

        <Link
          component={RouterLink}
          to="/politicas-privacidade"
          underline="none"
          color="inherit"
          sx={{
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'color 0.3s ease, textDecoration 0.3s ease',
            '&:hover': {
              color: theme.palette.secondary.main,
              textDecoration: 'none',
              color: '#01E0CD',

            }
          }}
        >
          Políticas de Privacidade
        </Link>
      </Box>

      <Typography variant="body1" component="p">
        © {new Date().getFullYear()} Rede Cuidar - Todos os direitos reservados
      </Typography>
    </Box>
  );
};

export default Footer;
