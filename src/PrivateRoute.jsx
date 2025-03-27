import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const authToken = localStorage.getItem('token');
  
  // Si no hay authToken, redirige a la página de login
  if (!authToken) {
    return <Navigate to="/" replace />;
  }

  return children; // Si está autenticado, muestra el contenido
}

export default PrivateRoute;
