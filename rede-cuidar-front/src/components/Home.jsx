import { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, Button, Container, Avatar,
  IconButton, Grid, Card, CardMedia, CardContent
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Slider from "react-slick";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Typed from 'typed.js';

// Imagens
import cuidados from '../assets/cuidados.jpg';
import saudemental from '../assets/saudemental.jpg';
import educacao from '../assets/educacao.jpg';
import fisioterapia from '../assets/fisioterapia.jpg';
import fundoHome from '../assets/home.jpg';
import grupodeidosos from '../assets/grupodeidosos.jpg';
import psicologa from '../assets/psicologa.jpg';
import cadeirante from '../assets/cadeirante.jpg';

const BluePrevArrow = (props) => (
  <IconButton onClick={props.onClick} sx={{
    color: '#0d47a1', position: 'absolute', top: '50%', left: 0,
    transform: 'translate(0, -50%)', zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
  }}>
    <ArrowBackIosIcon />
  </IconButton>
);

const BlueNextArrow = (props) => (
  <IconButton onClick={props.onClick} sx={{
    color: '#0d47a1', position: 'absolute', top: '50%', right: 0,
    transform: 'translate(0, -50%)', zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
  }}>
    <ArrowForwardIosIcon />
  </IconButton>
);

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prestadores, setPrestadores] = useState([]);
  const navigate = useNavigate();
  const typedEl = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedEl.current, {
      strings: [
        '<span class="typed-subtitle">Conectando quem precisa de cuidados com quem pode oferecer.</span>'
      ],
      typeSpeed: 40,
      showCursor: false,
      loop: false
    });
    return () => typed.destroy();
  }, []);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('token') === 'logado');
    const handleAuthChange = () => setIsLoggedIn(localStorage.getItem('token') === 'logado');
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  useEffect(() => {
    const fetchPrestadores = async () => {
      try {
        const response = await axios.get("http://localhost:8080/usuarios/oferecendo-servicos");
        setPrestadores(response.data.slice(0, 6));
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
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <Container maxWidth="lg">
      {/* 🔷 Carrossel com sobreposição */}
      <Box sx={{ position: 'relative', mt: 6, mb: 4, borderRadius: 3, overflow: 'hidden' }}>
        <Slider autoplay autoplaySpeed={4000} infinite arrows={false} dots={false} speed={800} slidesToShow={1} slidesToScroll={1}>
          {[cadeirante, grupodeidosos, psicologa].map((img, index) => (
            <Box
              key={index}
              sx={{
                height: { xs: 630, md: 400 },
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              <Box sx={{
                position: 'absolute', width: '100%', height: '100%',
                bgcolor: 'rgba(255,255,255,0.7)', top: 0, left: 0
              }} />
            </Box>
          ))}
        </Slider>

        <Box sx={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column',
          textAlign: 'center', px: 2
        }}>
          <Typography component="div">
            <div className="typed-title">Rede Cuidar</div>
            <div ref={typedEl}></div>
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mt: 4 }}>
            {!isLoggedIn && (
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/cadastro"
                sx={{
                  width: 220,
                  height: 50,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  borderRadius: '50px',
                  backgroundColor: '#0d47a1',
                  '&:hover': { backgroundColor: '#6aa3f7' }
                }}
              >
                Cadastre-se
              </Button>
            )}
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(isLoggedIn ? '/servicos' : '/bloqueado')}
              sx={{
                width: 220,
                height: 50,
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                color: '#0d47a1',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  color: '#0d47a1',
                  transform: 'scale(1.03)'
                }
              }}
            >
              Encontrar Serviços
            </Button>
          </Box>
        </Box>
      </Box>

      {/* 🔷 Profissionais em destaque */}
      <Typography variant="h5" sx={{ mt: 8, mb: 4, fontWeight: 600 }}>
        Profissionais em destaque
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Slider {...settings}>
          {prestadores.map((usuario) => (
            <Box key={usuario.id} px={1}>
              <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
                <Avatar
                  src={usuario.fotoPerfil ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}` : ''}
                  alt={usuario.nome}
                  sx={{ width: 80, height: 80, mx: 'auto', mt: 1 }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold">{usuario.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">{usuario.especialidade}</Typography>
                  <Typography variant="body2">{usuario.bairro}, {usuario.cidade} - {usuario.estado}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxHeight: 50, overflow: 'hidden' }}>
                    {usuario.descricaoServico || 'Sem descrição'}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button size="small" onClick={() => navigate(isLoggedIn ? `/perfil/${usuario.id}` : '/bloqueado')} sx={{ color: '#0d47a1' }}>Ver Perfil</Button>
                  <IconButton color="success" onClick={() => (isLoggedIn ? abrirWhatsapp(usuario.telefone) : navigate('/bloqueado'))}>
                    <WhatsAppIcon />
                  </IconButton>
                </Box>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* 🔷 Áreas de atuação */}
      <Typography variant="h5" sx={{ mt: 10, mb: 4, fontWeight: 600, textAlign: 'center' }}>
        Áreas de Atuação
      </Typography>

      <Grid container spacing={4}>
        {[{
          titulo: "Cuidados Pessoais",
          descricao: "Atenção dedicada para idosos, crianças e PCDs, com carinho, responsabilidade e segurança.",
          imagem: cuidados
        }, {
          titulo: "Saúde Mental",
          descricao: "Psicólogos e terapeutas comprometidos com o bem-estar emocional de cada pessoa.",
          imagem: saudemental
        }, {
          titulo: "Fisioterapia",
          descricao: "Reabilitação e cuidado com o corpo através de profissionais capacitados.",
          imagem: fisioterapia
        }, {
          titulo: "Infantil",
          descricao: "Profissionais dedicados ao cuidado infantil, promovendo o bem-estar, a higiene, a alimentação adequada e o desenvolvimento saudável das crianças.",
          imagem: educacao
        }].map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: index % 2 === 0 ? 'row' : 'row-reverse'
              },
              height: { xs: 'auto', sm: 200 },
              borderRadius: 2,
              boxShadow: 3,
              overflow: 'hidden'
            }}>
              <CardMedia
                component="img"
                image={item.imagem}
                alt={item.titulo}
                sx={{
                  width: { xs: '100%', sm: 1200 },
                  height: { xs: 160, sm: '100%' },
                  objectFit: 'cover'
                }}
              />
              <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                padding: 2
              }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>{item.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">{item.descricao}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔷 Estilo do texto animado */}
      <style>
        {`
          .typed-title {
            font-family: 'One Krona Text', sans-serif;
            font-weight: 900;
            font-size: 4rem;
            background: linear-gradient(to bottom, #0d47a1 0%, #42a5f5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
          }
          .typed-subtitle {
            font-family: 'One Krona Text', sans-serif;
            font-weight: 900;
            font-size: 2rem;
            background: linear-gradient(to bottom, #0d47a1 0%, #42a5f5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>
    </Container>
  );
};

export default Home;
