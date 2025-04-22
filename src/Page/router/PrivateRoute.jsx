import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Dashboard from "../Principal/Dashboard.jsx";
import Estadisticas from "../Principal/Estadisticas.jsx";
import Navbar from "../Principal/Componentes/Navbar.jsx";
import EditarUsuario from "../Principal/Vistas/EditarUsuario.jsx";

export default function PrivateRoute({ setIsAuthenticated }) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar Logout={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Estadisticas" element={<Estadisticas />} />
          <Route path="Dashboard/editar/:id" element={<EditarUsuario />} />
        </Route>
      </Routes>
    </>
  );
}

function Layout() {
  return <Outlet />;
}