import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email !== 'admin@redecuidar.com') {
      navigate('/');
      return;
    }

    carregarUsuarios();
    carregarComentarios();
  }, [navigate]);

  const carregarUsuarios = () => {
    fetch('http://localhost:8080/usuarios', { credentials: 'include' })
      .then((res) => res.ok ? res.json() : Promise.reject('Erro ao buscar usuários'))
      .then(setUsuarios)
      .catch((err) => console.error(err));
  };

  const carregarComentarios = () => {
    fetch('http://localhost:8080/avaliacoes/admin', { credentials: 'include' })
      .then((res) => res.ok ? res.json() : Promise.reject('Erro ao buscar avaliações'))
      .then(setComentarios)
      .catch((err) => {
        console.error(err);
        setComentarios([]);
      });
  };

  const excluirComentario = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação?")) return;
    try {
      const res = await fetch(`http://localhost:8080/avaliacoes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Erro ao excluir comentário');
      carregarComentarios();
    } catch (err) {
      alert(err.message || "Erro ao excluir");
    }
  };

  const abrirConfirmacaoExclusao = (usuario) => {
    setUserToDelete(usuario);
    setConfirmEmail('');
    setAdminPassword('');
    setDeleteError('');
  };

  const fecharConfirmacao = () => {
    setUserToDelete(null);
    setConfirmEmail('');
    setAdminPassword('');
    setDeleteError('');
  };

  const confirmarExclusao = async () => {
    if (confirmEmail !== userToDelete.email) {
      setDeleteError('Email digitado não corresponde ao usuário.');
      return;
    }
    if (!adminPassword) {
      setDeleteError('Senha do administrador é obrigatória.');
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:8080/usuarios/${userToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Erro ao excluir usuário');
      }

      carregarUsuarios();
      fecharConfirmacao();
    } catch (err) {
      setDeleteError(err.message || 'Erro inesperado');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Painel Administrativo
      </Typography>

      {/* Seção de Usuários */}
      <Paper sx={{ p: 4, mb: 6, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Gerenciamento de Usuários
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {usuarios.length === 0 ? (
          <Typography>Nenhum usuário encontrado.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {usuarios.map((u) => (
              <Box
                key={u.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 3,
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#1e1e1e',
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {u.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {u.email}
                  </Typography>
                  {u.ofereceServico && u.especialidade && (
                    <Chip
                      label={u.especialidade}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>

                {u.email.toLowerCase() !== 'admin@redecuidar.com' && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => abrirConfirmacaoExclusao(u)}
                  >
                    Excluir
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Seção de Comentários */}
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Gerenciamento de Avaliações
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {Array.isArray(comentarios) && comentarios.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {comentarios.map((c) => (
              <Box
                key={c.id}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#1e1e1e',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {c.nomeAvaliador || 'Usuário Anônimo'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(c.dataCriacao).toLocaleDateString('pt-BR')}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  "{c.comentario}"
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => excluirComentario(c.id)}
                  >
                    Excluir
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>Nenhum comentário encontrado.</Typography>
        )}
      </Paper>

      {/* Modal: confirmação exclusão usuário */}
      <Dialog open={Boolean(userToDelete)} onClose={fecharConfirmacao} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Confirmar exclusão do usuário</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3 }}>
            Para excluir o usuário <strong>{userToDelete?.email}</strong>, digite o email do usuário e a senha do administrador.
          </Typography>

          <TextField
            label="Digite o email do usuário"
            fullWidth
            margin="normal"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            disabled={deleting}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Senha do administrador"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            disabled={deleting}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharConfirmacao} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmarExclusao}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : 'Confirmar Exclusão'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;