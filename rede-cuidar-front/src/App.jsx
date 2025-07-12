import { Routes, Route } from 'react-router-dom';
import { CssBaseline, useTheme } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import Footer from './components//Footer/Footer';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Perfil from './components/Perfil/Perfil';
import CadastroUsuario from './components/CadastroUsuario/CadastroUsuario';
import ListaUsuarios from './components/ListaUsuarios/ListaUsuarios';
import EditarUsuario from './components/EditarUsuario/EditarUsuario';
import PerfilUsuario from './components/PerfilUsuario/PerfilUsuario';
import ListaServicos from './components/ListaServicos/ListaServicos';
import CadastroServico from './components/CadastroServico/CadastroServico';
import EditarServico from './components/EditarServico/EditarServico';
import DetalheServico from './components/DetalheServico/DetalheServico';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import Bloqueado from './components/Bloqueado/Bloqueado';
import QuemSomos from './components/QuemSomos/QuemSomos';
import FaleConosco from './components/FaleConosco/FaleConosco';
import AdminPage from './components/AdminPage/AdminPage';
import EsqueciSenha from './components/EsqueciSenha/EsqueciSenha';
import RedefinirSenha from './components/RedefinirSenha/RedefinirSenha';
import PoliticasPrivacidade from './components/PoliticasPrivacidade/PoliticasPrivacidade';





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
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="/politicas-privacidade" element={<PoliticasPrivacidade />} />

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
