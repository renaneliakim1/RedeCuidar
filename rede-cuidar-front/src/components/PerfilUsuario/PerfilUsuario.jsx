import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  TextField,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import {
  WhatsApp,
  Email,
  Phone,
  LocationOn,
  Work
} from '@mui/icons-material';

const formatarEspecialidade = (valor) => {
  if (!valor) return 'Não informado';
  return valor
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const PerfilUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [novaAvaliacao, setNovaAvaliacao] = useState('');
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const theme = useTheme();
  const usuarioLogadoEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`http://localhost:8080/usuarios/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar usuário');
        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        setErro('Erro ao carregar perfil do usuário.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      try {
        const response = await fetch(`http://localhost:8080/avaliacoes/usuario/${id}`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setAvaliacoes(data);
      } catch {
        setAvaliacoes([]);
      }
    };

    if (usuario) fetchAvaliacoes();
  }, [usuario, id]);

  const enviarAvaliacao = async () => {
    if (!novaAvaliacao.trim()) return;
    setEnviando(true);
    try {
      const response = await fetch(`http://localhost:8080/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          idAvaliado: usuario.id,
          comentario: novaAvaliacao.trim()
        })
      });

      if (!response.ok) throw new Error('Erro ao enviar avaliação');

      setNovaAvaliacao('');

      const res = await fetch(`http://localhost:8080/avaliacoes/usuario/${id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setAvaliacoes(data);

    } catch (e) {
      alert("Erro ao enviar avaliação");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (erro) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>
        <Button variant="contained" component={Link} to="/servicos">Voltar</Button>
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="info" sx={{ mb: 2 }}>Usuário não encontrado</Alert>
        <Button variant="contained" component={Link} to="/servicos">Voltar</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'background.paper'
      }}>
        {/* Cabeçalho com foto de capa */}
        <Box sx={{
          height: 200,
          bgcolor: theme.palette.mode === 'light' ? '#e3f2fd' : '#0d47a1',
          position: 'relative'
        }}>
          <Avatar
            src={usuario.fotoPerfil ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}` : undefined}
            alt={usuario.nome}
            sx={{
              width: 150,
              height: 150,
              border: '4px solid white',
              position: 'absolute',
              bottom: -75,
              left: 40,
            }}
          />
        </Box>

        {/* Corpo do perfil */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          p: 4,
          pt: 10,
          gap: 4
        }}>
          {/* Coluna esquerda - Informações básicas */}
          <Box sx={{ width: { md: '35%' } }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {usuario.nome}
            </Typography>

            <Chip
              label={formatarEspecialidade(usuario.especialidade) || 'Profissional'}
              color="primary"
              sx={{ mb: 3 }}
              icon={<Work />}
            />

            <Box sx={{
              bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#1e1e1e',
              p: 3,
              borderRadius: 2,
              mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Informações de Contato
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Email color="primary" sx={{ mr: 1.5 }} />
                <Typography>{usuario.email || 'Não informado'}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Phone color="primary" sx={{ mr: 1.5 }} />
                <Typography>{usuario.telefone || 'Não informado'}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <LocationOn color="primary" sx={{ mr: 1.5 }} />
                <Typography>
                  {[usuario.bairro, usuario.cidade, usuario.estado].filter(Boolean).join(', ') || 'Não informado'}
                </Typography>
              </Box>
            </Box>

            {usuario.telefone && (
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsApp />}
                fullWidth
                sx={{ mb: 2 }}
                href={`https://wa.me/55${usuario.telefone.replace(/\D/g, '')}`}
                target="_blank"
              >
                Contatar via WhatsApp
              </Button>
            )}

            <Button
              variant="outlined"
              fullWidth
              component={Link}
              to="/servicos"
            >
              Voltar para profissionais
            </Button>
          </Box>

          {/* Coluna direita - Detalhes profissionais */}
          <Box sx={{
            width: { md: '65%' },
            borderLeft: { md: `1px solid ${theme.palette.divider}` },
            pl: { md: 4 }
          }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Habilidades e Especialidades
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {usuario.especialidade ? (
                  usuario.especialidade.split(',').map((item, index) => (
                    <Chip
                      key={index}
                      label={item.trim()}
                      variant="outlined"
                      color="primary"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2">Nenhuma especialidade informada</Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Sobre Mim
              </Typography>
              <Typography>
                {usuario.descricaoServico || 'Nenhuma descrição fornecida.'}
              </Typography>
            </Box>

            {/* Avaliações */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Avaliações ({avaliacoes.length})
              </Typography>

              {avaliacoes.length === 0 ? (
                <Typography variant="body2">Nenhuma avaliação ainda.</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {avaliacoes.map((avaliacao, index) => (
                    <Box key={index} sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#1e1e1e'
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {avaliacao.dataCriacao || 'Data não disponível'}

                      </Typography>

                      <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
                        "{avaliacao.comentario}"
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        — {avaliacao.nomeAvaliador || 'Anônimo'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Formulário de avaliação */}
              {usuarioLogadoEmail && usuarioLogadoEmail !== usuario.email && (
                <Box sx={{ mt: 4, p: 3, bgcolor: theme.palette.background.default, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Deixe sua avaliação</Typography>

                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    value={novaAvaliacao}
                    onChange={(e) => setNovaAvaliacao(e.target.value)}
                    placeholder="Conte sua experiência com este profissional..."
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={enviarAvaliacao}
                    disabled={enviando || !novaAvaliacao.trim()}
                  >
                    {enviando ? 'Enviando...' : 'Enviar Avaliação'}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default PerfilUsuario;
