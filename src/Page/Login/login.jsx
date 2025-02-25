import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  
import 'primereact/resources/primereact.min.css';  
import 'primeicons/primeicons.css';  
import { useNavigate } from 'react-router-dom';
import fondo from '../Principal/Imagen/LogoABP.png';
import './login.css';  // Importar archivo CSS

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor ingresa un email y una contraseña');
      return;
    }

    console.log('Iniciando sesión con:', email, password);
    navigate('/Dashboard');
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="login-background">
      <img src={fondo} alt="fondo" />
      <div className="login-container">
        <h2>Iniciar sesión</h2>
        {error && <p className="error">{error}</p>}
        
        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        
        <div className="p-field">
          <label htmlFor="password">Contraseña</label>
          <div style={{ position: 'relative' }}>
            <InputText
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            onClick={handleSubmit}
            icon="pi pi-sign-in"
            className="p-button-rounded"
          />
        </div>
      </div>
    </div>
  );
}
