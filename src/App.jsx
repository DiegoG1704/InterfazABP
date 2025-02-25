import Login from './Page/Login/login.jsx';
import { Routes, Route, BrowserRouter } from 'react-router-dom'; // Importar BrowserRouter
import Dashboard from './Page/Principal/Dashboard.jsx';
import 'primeflex/primeflex.css';

function App() {
  return (
    <div className="App">
      {/* Envolver Routes con BrowserRouter */}
      <BrowserRouter>
        <Routes>
          {/* Definir las rutas dentro de Routes */}
          <Route path="/" element={<Login />} />
          <Route path='/Dashboard' element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
