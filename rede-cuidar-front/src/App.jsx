/*
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import ListaUsuarios from './components/ListaUsuarios';
import CadastroUsuario from './components/CadastroUsuario';
import EditarUsuario from './components/EditarUsuario';
import PerfilUsuario from './components/PerfilUsuario';
import ListaServicos from './components/ListaServicos';
import CadastroServico from './components/CadastroServico';
import EditarServico from './components/EditarServico';
import DetalheServico from './components/DetalheServico';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Perfil from './components/Perfil';
import { useThemeContext } from './components/ThemeContext';
import Bloqueado from './components/Bloqueado';





function App() {
  const { theme } = useThemeContext();

  return (
    <>
      <CssBaseline />
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 128px)', padding: '24px 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/servicos" element={<ListaServicos />} />
          <Route path="/perfil/:id" element={<PerfilUsuario />} />
          <Route path="/usuarios" element={<PrivateRoute><ListaUsuarios /></PrivateRoute>} />
          <Route path="/usuarios/novo" element={<PrivateRoute><CadastroUsuario /></PrivateRoute>} />
          <Route path="/usuarios/editar/:id" element={<PrivateRoute><EditarUsuario /></PrivateRoute>} />
          <Route path="/usuarios/:id" element={<PrivateRoute><PerfilUsuario /></PrivateRoute>} />
          <Route path="/servicos/novo" element={<PrivateRoute><CadastroServico /></PrivateRoute>} />
          <Route path="/servicos/editar/:id" element={<PrivateRoute><EditarServico /></PrivateRoute>} />
          <Route path="/servicos/:id" element={<PrivateRoute><DetalheServico /></PrivateRoute>} />
          <Route path="/bloqueado" element={<Bloqueado />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App; */


import { Routes, Route } from 'react-router-dom';
import { CssBaseline, useTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import ListaUsuarios from './components/ListaUsuarios';
import CadastroUsuario from './components/CadastroUsuario';
import EditarUsuario from './components/EditarUsuario';
import PerfilUsuario from './components/PerfilUsuario';
import ListaServicos from './components/ListaServicos';
import CadastroServico from './components/CadastroServico';
import EditarServico from './components/EditarServico';
import DetalheServico from './components/DetalheServico';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Perfil from './components/Perfil';
import Bloqueado from './components/Bloqueado';
import QuemSomos from './components/QuemSomos';

function App() {
  const theme = useTheme();

  return (
    <>
      <CssBaseline />
      <Navbar />
      <main style={{
        minHeight: 'calc(100vh - 128px)',
        padding: '24px 0',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/servicos" element={<ListaServicos />} />
          <Route path="/perfil/:id" element={<PerfilUsuario />} />
          <Route path="/usuarios" element={<PrivateRoute><ListaUsuarios /></PrivateRoute>} />
          <Route path="/usuarios/novo" element={<PrivateRoute><CadastroUsuario /></PrivateRoute>} />
          <Route path="/usuarios/editar/:id" element={<PrivateRoute><EditarUsuario /></PrivateRoute>} />
          <Route path="/usuarios/:id" element={<PrivateRoute><PerfilUsuario /></PrivateRoute>} />
          <Route path="/servicos/novo" element={<PrivateRoute><CadastroServico /></PrivateRoute>} />
          <Route path="/servicos/editar/:id" element={<PrivateRoute><EditarServico /></PrivateRoute>} />
          <Route path="/servicos/:id" element={<PrivateRoute><DetalheServico /></PrivateRoute>} />
          <Route path="/bloqueado" element={<Bloqueado />} />
          <Route path="/quem-somos" element={<QuemSomos />} />

        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

