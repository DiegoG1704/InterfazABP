import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestRouter from "./Page/router/GuestRouter.jsx";
import PrivateRoute from "./Page/router/PrivateRoute.jsx";
import "../node_modules/primeflex/primeflex.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      console.log("Usuario no autenticado, redirigiendo al login"); // <-- Depuración
      navigate("/"); // Redirigir al login
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return isAuthenticated ? (
    <PrivateRoute setIsAuthenticated={setIsAuthenticated} />
  ) : (
    <GuestRouter setIsAuthenticated={setIsAuthenticated} />
  );
}

export default App;
