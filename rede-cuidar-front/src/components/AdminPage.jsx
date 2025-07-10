import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
  InputAdornment
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    console.log("Comentários recebidos:", comentarios)
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
    <>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h3" gutterBottom>Painel Administrativo</Typography>

        {/* Usuários */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" gutterBottom>Usuários</Typography>
          {usuarios.length === 0 ? (
            <Typography>Nenhum usuário encontrado.</Typography>
          ) : (
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              {usuarios.map((u) => (
                <Box
                  component="li"
                  key={u.id}
                  sx={{
                    mb: 1,
                    p: 1,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{u.nome} - {u.email}</span>
                  {u.email.toLowerCase() !== 'admin@redecuidar.com' && (
                    <Button variant="outlined" color="error" onClick={() => abrirConfirmacaoExclusao(u)}>
                      Excluir
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Comentários */}
        <Box>
          <Typography variant="h5" gutterBottom>Comentários</Typography>
          {Array.isArray(comentarios) && comentarios.length > 0 ? (
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
            {comentarios.map((c) => {
              console.log(c);
              return (
                <Box
                  component="li"
                  key={c.id}
                  sx={(theme) => ({
                    mb: 2,
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    backgroundColor:
                      theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
                    color: theme.palette.text.primary
                  })}
                >
                  <Typography variant="subtitle2">
                    <strong>{c.nomeAvaliador || 'Usuário'}</strong> comentou:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>{c.comentario}</strong>
                  </Typography>

                  <Button variant="outlined" color="error" onClick={() => excluirComentario(c.id)}>
                    Excluir Comentário
                  </Button>
                </Box>
              );
            })}

            </Box>
          ) : (
            <Typography>Nenhum comentário encontrado.</Typography>
          )}
        </Box>
      </Box>

      {/* Modal: confirmação exclusão usuário */}
      <Dialog open={Boolean(userToDelete)} onClose={fecharConfirmacao}>
        <DialogTitle>Confirmar exclusão do usuário</DialogTitle>
        <DialogContent>
          <p>
            Para excluir o usuário <b>{userToDelete?.email}</b>, digite o email do usuário e a senha do administrador.
          </p>
          <TextField
            label="Digite o email do usuário"
            fullWidth
            margin="normal"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            disabled={deleting}
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
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharConfirmacao} disabled={deleting}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={confirmarExclusao} disabled={deleting}>
            {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminPage;
