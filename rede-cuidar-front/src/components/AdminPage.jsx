import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

const AdminPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [servicoAtual, setServicoAtual] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('email');
    const isAdmin = email === 'admin@redecuidar.com';
    if (!isAdmin) {
      navigate('/');
      return;
    }
    carregarUsuarios();
    carregarServicos();
  }, [navigate]);

  const carregarUsuarios = () => {
    fetch('http://localhost:8080/usuarios', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar usuários');
        return res.json();
      })
      .then(setUsuarios)
      .catch((err) => console.error('Erro ao carregar usuários', err));
  };



  const carregarServicos = () => {
    fetch('http://localhost:8080/api/servicos', {
      credentials: 'include', // envia o cookie da sessão
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar serviços');
        return res.json();
      })
      .then(setServicos)
      .catch((err) => console.error('Erro ao carregar serviços', err));
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
    setDeleteError('');

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

  const abrirFormAdicionar = () => {
    setServicoAtual(null);
    setTitulo('');
    setDescricao('');
    setPreco('');
    setFormError('');
    setOpenForm(true);
  };

  const abrirFormEditar = (servico) => {
    setServicoAtual(servico);
    setTitulo(servico.titulo);
    setDescricao(servico.descricaoServico || '');
    setPreco(servico.preco);
    setFormError('');
    setOpenForm(true);
  };

  const fecharForm = () => {
    setOpenForm(false);
  };

  const salvarServico = () => {
    if (!titulo.trim()) {
      setFormError('O título é obrigatório');
      return;
    }

    setFormLoading(true);
    setFormError('');

    fetch('http://localhost:8080/api/servicos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao salvar serviço');
        return res.json();
      })
      .then(() => {
        carregarServicos();
        fecharForm();
      })
      .catch((err) => setFormError(err.message))
      .finally(() => setFormLoading(false));
  };

  const excluirServico = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;

    fetch(`http://localhost:8080/api/servicos/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) carregarServicos();
        else alert('Erro ao excluir serviço');
      })
      .catch(() => alert('Erro ao excluir serviço'));
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

        {/* Serviços */}
    {/* Serviços */}
    <Box>
      <Typography variant="h5" gutterBottom>Serviços</Typography>

      <Button variant="contained" sx={{ mb: 2 }} onClick={abrirFormAdicionar}>
        Adicionar Serviço
      </Button>

      {servicos.length === 0 ? (
        <Typography>Nenhum serviço encontrado.</Typography>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
          {servicos.map((s) => (
            <Box
              component="li"
              key={s.id}
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
              <span>{s.titulo}</span>
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => excluirServico(s.id)}
                >
                  Excluir
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>

      </Box>

      {/* Modal: formulário serviço */}
      <Dialog open={openForm} onClose={fecharForm} fullWidth maxWidth="sm">
        <DialogTitle>Adicionar Serviço</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <TextField
            label="Título"
            fullWidth
            margin="normal"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharForm} disabled={formLoading}>Cancelar</Button>
          <Button onClick={salvarServico} variant="contained" disabled={formLoading}>
            {formLoading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>


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
            type="password"
            fullWidth
            margin="normal"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            disabled={deleting}
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
