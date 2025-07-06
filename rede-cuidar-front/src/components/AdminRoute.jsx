import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
