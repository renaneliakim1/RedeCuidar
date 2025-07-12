import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PoliticasPrivacidade = () => {
  return (
    <Container maxWidth="md">
      <Box mt={4} mb={6}>
        <Typography variant="h4" gutterBottom>
          Políticas de Privacidade
        </Typography>
        <Typography variant="body1" paragraph>
          A sua privacidade é importante para nós. Esta política descreve como coletamos, usamos e protegemos suas informações ao utilizar a plataforma Rede Cuidar+.
        </Typography>

        <Typography variant="h6" gutterBottom>
          1. Coleta de Dados
        </Typography>
        <Typography variant="body1" paragraph>
          Coletamos informações fornecidas por você no momento do cadastro, como nome, email, telefone, endereço, especialidade (caso ofereça serviços) e foto de perfil.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Uso das Informações
        </Typography>
        <Typography variant="body1" paragraph>
          Utilizamos os dados para criar seu perfil, facilitar conexões com outros usuários, exibir serviços ofertados, além de melhorar a experiência na plataforma.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Compartilhamento
        </Typography>
        <Typography variant="body1" paragraph>
          As informações públicas do seu perfil (como nome, especialidade e contato) podem ser visualizadas por outros usuários. Seus dados não são vendidos ou repassados a terceiros.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Segurança
        </Typography>
        <Typography variant="body1" paragraph>
          Adotamos medidas de segurança para proteger seus dados, como criptografia de senha e controle de acesso. No entanto, nenhum sistema é 100% seguro.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Seus Direitos
        </Typography>
        <Typography variant="body1" paragraph>
          Você pode acessar, corrigir ou excluir suas informações a qualquer momento. Para isso, acesse a seção "Perfil" ou entre em contato conosco.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Alterações nesta Política
        </Typography>
        <Typography variant="body1" paragraph>
          Podemos atualizar esta política ocasionalmente. Notificaremos os usuários em caso de mudanças significativas.
        </Typography>

        <Typography variant="body2" color="textSecondary" mt={4}>
          Última atualização: julho de 2025
        </Typography>
      </Box>
    </Container>
  );
};

export default PoliticasPrivacidade;
