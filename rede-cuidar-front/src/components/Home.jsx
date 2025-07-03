import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Container, Card, CardContent, Avatar,
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import Slider from "react-slick";

// Ícones para as setas do carrossel
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// CSS do slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';


// Setas azuis customizadas para o react-slick
const BluePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        color: '#1976d2',
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: 'translate(0, -50%)',
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
      }}
      aria-label="previous"
    >
      <ArrowBackIosIcon />
    </IconButton>
  );
};

const BlueNextArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        color: '#1976d2',
        position: 'absolute',
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
      }}
      aria-label="next"
    >
      <ArrowForwardIosIcon />
    </IconButton>
  );
};

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prestadores, setPrestadores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const logado = localStorage.getItem('token') === 'logado';
    setIsLoggedIn(logado);

    const handleAuthChange = () => {
      setIsLoggedIn(localStorage.getItem('token') === 'logado');
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  useEffect(() => {
    const fetchPrestadores = async () => {
      try {
        const response = await axios.get("http://localhost:8080/usuarios/oferecendo-servicos");
        setPrestadores(response.data.slice(0, 6)); // mostra no máximo 6
      } catch (error) {
        console.error("Erro ao buscar prestadores:", error);
      }
    };

    fetchPrestadores();
  }, []);

  const abrirWhatsapp = (telefone) => {
    const numero = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${numero}`, '_blank');
  };

  const settings = {
    dots: true,
    infinite: prestadores.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <BlueNextArrow />,
    prevArrow: <BluePrevArrow />,
    responsive: [
      {
        breakpoint: 960,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          Bem-vindo ao <span style={{ color: '#1976d2' }}>Rede Cuidar</span>
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Conectando quem precisa de cuidados com quem pode oferecer
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mt: 4 }}>
          {!isLoggedIn && (
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/cadastro"
              sx={{
                backgroundColor: '#1976d2',
                borderRadius: '50px',
                px: 4,
                '&:hover': { backgroundColor: '#1565c0' }
              }}
            >
              Cadastre-se
            </Button>
          )}

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(isLoggedIn ? '/servicos' : '/bloqueado')}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              borderRadius: '50px',
              px: 4,
              '&:hover': {
                backgroundColor: '#e3f2fd',
                borderColor: '#1565c0',
                color: '#1565c0',
              }
            }}
          >
            Encontrar Serviços
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ mt: 8, mb: 4, fontWeight: 600 }}>
        Profissionais em destaque
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Slider {...settings}>
          {prestadores.map((usuario) => (
            <Box key={usuario.id} px={1}>
              <Card
                sx={{
                  height: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: 1,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              >
                <Avatar
                  src={usuario.fotoPerfil ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}` : ''}
                  alt={usuario.nome}
                  sx={{
                    width: 80,
                    height: 80,
                    alignSelf: 'center',
                    mt: 2,
                    mb: 1
                  }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {usuario.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {usuario.especialidade}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {usuario.bairro}, {usuario.cidade} - {usuario.estado}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxHeight: 50, overflow: 'hidden' }}>
                    {usuario.descricaoServico || 'Sem descrição'}
                  </Typography>
                </CardContent>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    onClick={() => navigate(isLoggedIn ? `/perfil/${usuario.id}` : '/bloqueado')}
                    sx={{ color: '#1976d2' }}
                  >
                    Ver Perfil
                  </Button>
                  <IconButton
                    color="success"
                    onClick={() => (isLoggedIn ? abrirWhatsapp(usuario.telefone) : navigate('/bloqueado'))}
                    aria-label="Whatsapp"
                  >
                    <WhatsAppIcon />
                  </IconButton>
                </Box>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
    </Container>

  );
};

export default Home;
