import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  
import 'primereact/resources/primereact.min.css';  
import 'primeicons/primeicons.css';  
import { useNavigate } from 'react-router-dom';
import './login.css';  // Importar archivo CSS
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [datos, setDatos] = useState({ username: "", password: "" });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const login = async () => {
    
    if (datos.username === '' || datos.password === '') {
       setError('Por favor ingrese su correo y contraseña.');
       return;
     } 
   try {
    const response = await axios.post(`http://localhost:3000/login`, datos);
     if (!response.data || !response.data.access_token) {
       setError("No se recibió un token válido.");
       return;
     }
     const token = response.data.access_token;
     localStorage.setItem("authToken", token);
     setError(null);
     setDatos({ username: "", password: "" });
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
          <label htmlFor="email">Username</label>
          <InputText
            name="username"
            placeholder="Ingrese su username..."
            value={datos.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="p-field">
          <label htmlFor="password">Contraseña</label>
          <div style={{ position: 'relative' }}>
            <InputText
              name="password"
              placeholder="Ingrese su contraseña..."
              value={datos.password}
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
