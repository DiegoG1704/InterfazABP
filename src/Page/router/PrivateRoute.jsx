import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Dashboard from "../Principal/Dashboard.jsx";
import Estadisticas from "../Principal/Estadisticas.jsx";
import Navbar from "../Principal/Componentes/Navbar.jsx";

export default function PrivateRoute({ setIsAuthenticated }) {
  return (
    <>
      <Navbar Logout={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="Dashboard" element={<Dashboard/>} />
          <Route path="Estadisticas" element={<Estadisticas/>} />
        </Route>
      </Routes>
    </>
  );
}

function Layout() {
  return <Outlet />;
}
