import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Avatar, CircularProgress, Alert, TextField } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

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

  const usuarioLogadoEmail = localStorage.getItem("email");

  // Buscar dados do usuário
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

  // Buscar avaliações
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
      // Atualiza avaliações
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
      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (erro) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error">{erro}</Alert>
        <Box mt={2}>
          <Button variant="contained" component={Link} to="/servicos">Voltar</Button>
        </Box>
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="info">Usuário não encontrado.</Alert>
        <Box mt={2}>
          <Button variant="contained" component={Link} to="/servicos">Voltar</Button>
        </Box>
      </Container>
    );
  }

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Perfil do Usuário
      </Typography>

      <Box display="flex" justifyContent="center" mb={3}>
        <Avatar
          src={usuario.fotoPerfil ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}` : undefined}
          alt={usuario.nome}
          sx={{ width: 150, height: 150 }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1"><strong>Nome:</strong> {usuario.nome}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {usuario.email}</Typography>
        <Typography variant="body1"><strong>Telefone:</strong> {usuario.telefone || '-'}</Typography>
        <Typography variant="body1"><strong>CEP:</strong> {usuario.cep || '-'}</Typography>
        <Typography variant="body1"><strong>Bairro:</strong> {usuario.bairro || '-'}</Typography>
        <Typography variant="body1"><strong>Cidade:</strong> {usuario.cidade || '-'}</Typography>
        <Typography variant="body1"><strong>Estado:</strong> {usuario.estado || '-'}</Typography>
        <Typography variant="body1"><strong>Especialidade:</strong> {formatarEspecialidade(usuario.especialidade)}</Typography>
        <Typography variant="body1"><strong>Descrição do Serviço:</strong> {usuario.descricaoServico || 'Sem descrição'}</Typography>
      </Box>

      <Box textAlign="center" mt={3} display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" component={Link} to="/servicos">Voltar</Button>
        {usuario.telefone && (
          <Button
            variant="outlined"
            color="success"
            startIcon={<WhatsAppIcon />}
            href={`https://wa.me/55${usuario.telefone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </Button>
        )}
      </Box>

      {usuarioLogadoEmail && usuarioLogadoEmail !== usuario.email && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Avaliar este profissional</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Escreva sua avaliação"
            value={novaAvaliacao}
            onChange={(e) => setNovaAvaliacao(e.target.value)}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              disabled={enviando || !novaAvaliacao.trim()}
              onClick={enviarAvaliacao}
            >
              Enviar Avaliação
            </Button>
          </Box>
        </Box>
      )}

      <Box mt={5}>
        <Typography variant="h6" gutterBottom>Avaliações</Typography>
        {avaliacoes.length === 0 ? (
          <Typography variant="body2">Nenhuma avaliação ainda.</Typography>
        ) : (
          avaliacoes.map((avaliacao, index) => (
            <Box key={index} sx={{ p: 2, mb: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="subtitle2">
                <strong>{avaliacao.nomeAvaliador || 'Usuário'}</strong> comentou em {formatarData(avaliacao.dataCriacao)}:
              </Typography>
              <Typography variant="body1"><strong>{avaliacao.comentario}</strong></Typography>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default PerfilUsuario;
