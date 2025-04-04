import React, { useState } from 'react';
import '../Styles/Navbar.css';
import Logo from '../Imagen/LogoABP.png';

import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export default function Navbar({ Logout }) {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menú hamburguesa
  const navigate = useNavigate();

  const submit = () => {
    // Eliminar el 'authToken' del localStorage
    localStorage.removeItem('authToken');
    Logout(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Alternar el estado del menú hamburguesa
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Logo" className="navbar-logo" />
          </Link>
        </div>

        {/* Rutas visibles en pantallas grandes */}
        <div className="nav-links">
          <Link to="/Dashboard">Afiliados</Link>
          <Link to="/Estadisticas">Estadísticas</Link>
          <Button onClick={submit} severity="danger" outlined>Cerrar Sesion</Button>
        </div>

        {/* Menú hamburguesa en pantallas pequeñas */}
        <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </nav>

      {/* Sidebar que aparece solo cuando se presiona el botón hamburguesa */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Logo" className="navbar-logo-Side" />
          </Link>
        </div>
        <div className="sidebar-links">
          <Link to="/Dashboard">Afiliados</Link>
          <Link to="/Estadisticas">Estadísticas</Link>
          <Link to="/Estadisticas">Estadísticas</Link>
          {/* Botón de Logout en el sidebar */}
          <Button onClick={submit} severity="danger" outlined className="sidebar-logout-button">Cerrar Sesion</Button>
        </div>
      </div>
    </header>
  );
}
