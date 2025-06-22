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
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Bem-vindo ao Rede Cuidar
        </Typography>
        <Typography variant="h5" paragraph>
          Conectando quem precisa de cuidados com quem pode oferecer
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!isLoggedIn && (
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/cadastro"
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' }
              }}
            >
              Cadastre-se
            </Button>
          )}

          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/servicos"
            sx={{
              color: '#1976d2',
              borderColor: '#1976d2',
              '&:hover': { borderColor: '#1565c0' }
            }}
          >
            Encontrar Serviços
          </Button>
        </Box>
      </Box>

      {/* Seção de Prestadores de Serviço com carrossel */}
      <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
        Profissionais em destaque
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Slider {...settings}>
          {prestadores.map((usuario) => (
            <Box key={usuario.id} px={1}>
              <Card sx={{
                height: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                mx: 1
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar
                      src={usuario.fotoPerfil ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}` : ''}
                      alt={usuario.nome}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {usuario.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {usuario.especialidade}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {usuario.bairro}, {usuario.cidade} - {usuario.estado}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxHeight: 50,
                    }}
                  >
                    {usuario.descricaoServico || 'Sem descrição'}
                  </Typography>
                </CardContent>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 1 }}>
                  <Button
                    size="small"
                    component={Link}
                    to={`/perfil/${usuario.id}`}
                    sx={{
                      color: '#1976d2',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Ver Perfil
                  </Button>
                  <IconButton
                    color="success"
                    onClick={() => abrirWhatsapp(usuario.telefone)}
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
