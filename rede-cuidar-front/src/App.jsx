import { Routes, Route } from 'react-router-dom';
import { CssBaseline, useTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Perfil from './components/Perfil';
import CadastroUsuario from './components/CadastroUsuario';
import ListaUsuarios from './components/ListaUsuarios';
import EditarUsuario from './components/EditarUsuario';
import PerfilUsuario from './components/PerfilUsuario';
import ListaServicos from './components/ListaServicos';
import CadastroServico from './components/CadastroServico';
import EditarServico from './components/EditarServico';
import DetalheServico from './components/DetalheServico';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Bloqueado from './components/Bloqueado';
import QuemSomos from './components/QuemSomos';
import FaleConosco from './components/FaleConosco';
import AdminPage from './components/AdminPage';


function App() {
  const theme = useTheme();

  return (
    <>
      <CssBaseline />
      <Navbar />
      <main
        style={{
          minHeight: 'calc(100vh - 128px)',
          padding: '24px 0',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/fale-conosco" element={<FaleConosco />} />
          <Route path="/bloqueado" element={<Bloqueado />} />
          <Route path="/servicos" element={<ListaServicos />} />

          {/* Rotas privadas usuárias comuns e admin */}
          <Route element={<PrivateRoute />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/:id" element={<PerfilUsuario />} />

            <Route path="/usuarios" element={<ListaUsuarios />} />
            <Route path="/usuarios/novo" element={<CadastroUsuario />} />
            <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />
            <Route path="/usuarios/:id" element={<PerfilUsuario />} />

            <Route path="/servicos/novo" element={<CadastroServico />} />
            <Route path="/servicos/editar/:id" element={<EditarServico />} />
            <Route path="/servicos/:id" element={<DetalheServico />} />
          </Route>

          {/* Rotas só para admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
