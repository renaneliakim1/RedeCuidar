import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Verificação simples de autenticação usando localStorage
  const isAuthenticated = localStorage.getItem('token') !== null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;