import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  
import 'primereact/resources/primereact.min.css';  
import 'primeicons/primeicons.css';  
import { useNavigate } from 'react-router-dom';
import './login.css';  // Importar archivo CSS
import axios from 'axios';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [datos, setDatos] = useState({ usuario: "", contraseña: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const login = async () => {
    // Validación básica de campos vacíos
    if (datos.usuario === '' || datos.contraseña === '') {
       setError('Por favor ingrese su correo y contraseña.');
       return;
     } 

    try {
      // Realiza la petición POST al backend
      const response = await axios.post(`https://backendabp.massalud.org.pe/login`, datos);

      // Verifica si la respuesta es válida
      if (!response.data || !response.data.access_token) {
        setError("No se recibió un token válido.");
        return;
      }

      // Si el login es exitoso, guarda el token y cambia el estado de autenticación
      const token = response.data.access_token;
      localStorage.setItem("authToken", token);

      // Llama a onLogin con true para indicar que el usuario está autenticado
      onLogin(true);

      // Limpia los campos de input y el error
      setError(null);
      setDatos({ usuario: "", contraseña: "" });

      // Redirige al Dashboard después del login
      navigate("/Dashboard");

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Datos incorrectos, por favor intente de nuevo.");
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h2>Iniciar sesión</h2>
        {error && <p className="error">{error}</p>}
        
        <div className="p-field">
          <label htmlFor="email">Usuario</label>
          <InputText
            name="usuario"
            placeholder="Ingrese su usuario..."
            value={datos.usuario}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="p-field">
          <label htmlFor="contraseña">Contraseña</label>
          <div style={{ position: 'relative' }}>
            <InputText
              name="contraseña"
              placeholder="Ingrese su contraseña..."
              value={datos.contraseña}
              onChange={handleChange}
              required
              type={showPassword ? 'text' : 'password'}
            />
            <Button
              icon={showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
              onClick={() => setShowPassword(!showPassword)}
              className="p-button-rounded p-button-text"
              aria-label="Mostrar contraseña"
            />
          </div>
        </div>
        
        <div className="p-d-flex p-jc-center">
          <Button
            label="Iniciar sesión"
            onClick={login}
            icon="pi pi-sign-in"
            className="p-button-rounded"
          />
        </div>
      </div>
    </div>
  );
}
