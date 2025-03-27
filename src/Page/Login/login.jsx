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
  const [datos, setDatos] = useState({ usuario: "", contraseña: "" });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const login = async () => {
    if (datos.usuario === '' || datos.contraseña === '') {
        setError('Por favor ingrese su usuario y contraseña.');
        return;
    } 
    try {
        const response = await axios.post(`http://localhost:3000/login`, datos, { withCredentials: true });
        console.log("Respuesta del servidor:", response.data); // 🔍 Verifica la respuesta

        if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            navigate("/Dashboard"); // Redirige solo si el login es exitoso
        } else {
            setError("Datos incorrectos, por favor intente de nuevo.");
        }
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
          <label htmlFor="email">usuario</label>
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
