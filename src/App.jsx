import Login from './Page/Login/login.jsx';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './Page/Principal/Dashboard.jsx';
import 'primeflex/primeflex.css';
import PrivateRoute from './PrivateRoute.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Ruta protegida */}
          <Route 
            path="/Dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
