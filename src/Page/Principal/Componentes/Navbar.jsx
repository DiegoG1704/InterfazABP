import { useState } from 'react';
import '../Styles/Navbar.css';
import Logo from '../Imagen/LogoABP.png';

import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Users, BarChart2 ,LogOut, CreditCard} from "lucide-react"

export default function Navbar({ Logout }) {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menú hamburguesa
  // const navigate = useNavigate();

  const submit = () => {
    // // Eliminar el 'authToken' del localStorage
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('RefreshToken');
    // Logout(false);
    // navigate('/');
    Logout()
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
        <div className="nav-links h-full  flex items-center justify-center">
          <div className=' flex items-center navbar-link'><Users className="h-4 w-4 mr-2" /> <Link to="/Dashboard">Afiliados</Link></div>
          <div className='flex items-center  navbar-link'><BarChart2 className="h-4 w-4 mr-2" /> <Link to="/Estadisticas" className=''>Estadísticas</Link></div>
          <div className='flex items-center  navbar-link'> <CreditCard className="h-4 w-4 mr-2" /> <Link to="/Pagos" className=''>Pagos</Link></div>
          <div className='navbar-link'>
            <Button onClick={submit} severity="danger" className='btn-sign-out' outlined><LogOut className="h-4 w-4 " />Cerrar Sesión</Button>
          </div>

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
          {/* Botón de Logout en el sidebar */}
          <Button onClick={submit} severity="danger" outlined className="sidebar-logout-button"> Cerrar Sesion</Button>
        </div>
      </div>
    </header>
  );
}
