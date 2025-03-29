import React from "react";
import { Route, Routes} from "react-router-dom";
import Dashboard from "../Principal/Dashboard.jsx";
import Estadisticas from "../Principal/Estadisticas.jsx";

export default function PrivateRoute({ setIsAuthenticated }) {
  return (
    <>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard Logout={setIsAuthenticated} />} />
        <Route path="/Estadisticas" element={<Estadisticas Logout={setIsAuthenticated}/> } />
      </Routes>
    </>
  );
}
