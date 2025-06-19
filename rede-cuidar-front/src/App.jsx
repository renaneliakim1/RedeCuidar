import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
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



const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 128px)', padding: '24px 0' }}>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/cadastro" element={<CadastroUsuario />} />
            <Route path="/servicos" element={<ListaServicos />} />
            <Route path="/perfil/:id" element={<PerfilUsuario />} />


            {/* Rotas protegidas - Usuários */}
            <Route path="/usuarios" element={
              <PrivateRoute>
                <ListaUsuarios />
              </PrivateRoute>
            } />
            <Route path="/usuarios/novo" element={
              <PrivateRoute>
                <CadastroUsuario />
              </PrivateRoute>
            } />
            <Route path="/usuarios/editar/:id" element={
              <PrivateRoute>
                <EditarUsuario />
              </PrivateRoute>
            } />
            <Route path="/usuarios/:id" element={
              <PrivateRoute>
                <PerfilUsuario />
              </PrivateRoute>
            } />

            {/* Rotas protegidas - Serviços */}
            <Route path="/servicos/novo" element={
              <PrivateRoute>
                <CadastroServico />
              </PrivateRoute>
            } />
            <Route path="/servicos/editar/:id" element={
              <PrivateRoute>
                <EditarServico />
              </PrivateRoute>
            } />
            <Route path="/servicos/:id" element={
              <PrivateRoute>
                <DetalheServico />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;