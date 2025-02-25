import React, { useRef } from 'react';
import '../Styles/Navbar.css';
import Logo from '../Imagen/LogoABP.png';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ setSearchTerm }) {
  const menuLeft = useRef(null);
  const navigate = useNavigate(); // Usar useNavigate para redirigir

  const items = [
    {
      label: 'Opciones',
      items: [
        {
          label: 'Cerrar Sesion',
          icon: 'pi pi-sign-out',
          // Redirigir al hacer clic en "Cerrar Sesion"
          command: () => {
            // Aquí puedes agregar cualquier lógica de cierre de sesión si es necesario
            navigate('/');  // Redirigir a la página principal
          }
        },
      ]
    }
  ];

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <a href="/">
            <img src={Logo} alt="Logo" className="navbar-logo" />
          </a>
          <InputText 
            placeholder="Buscar miembro..." 
            className="search-input" 
            onChange={(e) => setSearchTerm(e.target.value)}  // Actualizar el término de búsqueda
          />
        </div>
        <div className="button-container">
          <Button label="ABP" className="navbar-button" onClick={(event) => menuLeft.current.toggle(event)} />
          <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
        </div>
      </nav>
    </header>
  );
}
