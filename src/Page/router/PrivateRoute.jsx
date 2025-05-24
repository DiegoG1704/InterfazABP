import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Dashboard from "../Principal/Dashboard.jsx";
import Estadisticas from "../Principal/Estadisticas.jsx";
import Navbar from "../Principal/Componentes/Navbar.jsx";
import EditarUsuario from "../Principal/Vistas/EditarUsuario.jsx";
import PaymetPage from "../../features/payments/PaymetPage.jsx";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/sign-in/store/authSlice.js";

export default function PrivateRoute() {
  // const token = localStorage.getItem("authToken");

  // if (!token) {
  //   // Si no hay token, redirige al login
  //   return <Navigate to="/" replace />;
  // }
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <>
      <Navbar Logout={handleLogout} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="Dashboard" replace />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Pagos" element={<PaymetPage />} />
          <Route path="Estadisticas" element={<Estadisticas />} />
          <Route path="Dashboard/editar/:id" element={<EditarUsuario />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

function Layout() {
  return <Outlet />;
}