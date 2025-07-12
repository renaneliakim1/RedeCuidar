import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const QuemSomos = () => {
  return (
    <Container maxWidth="md" sx={{ my: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700} align="center">
          Quem Somos

        </Typography>

        <Typography variant="body1" paragraph>
          A <strong>Rede Cuidar</strong> é uma plataforma digital criada para conectar pessoas que buscam
          cuidados e serviços especializados com profissionais qualificados. Nosso objetivo é facilitar
          o acesso a serviços de cuidados pessoais, saúde, educação e muito mais, promovendo inclusão social
          e valorização dos prestadores.
        </Typography>

        <Typography variant="body1" paragraph>
          Por meio do nosso sistema, usuários podem se cadastrar para oferecer serviços ou buscar profissionais
          conforme suas necessidades, com filtros por especialidade, disponibilidade e localização.
          Garantimos uma experiência intuitiva, segura e acessível para todos.
        </Typography>

        <Typography variant="body1" paragraph>
          Nosso compromisso é com a qualidade, transparência e empatia, criando uma rede de apoio confiável
          para quem precisa e para quem deseja cuidar.
        </Typography>

        <Typography variant="body1" paragraph>
          Junte-se a nós e faça parte dessa comunidade que transforma cuidado em conexão!
        </Typography>
      </Paper>
    </Container>
  );
};

export default QuemSomos;
