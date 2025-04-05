// axiosToken.js
import axios from 'axios';

const axiosToken = () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        console.log('No se encontró token de autenticación.');
        return null;
    }

    const instance = axios.create({
        baseURL: 'https://backendabp.massalud.org.pe/', // Puedes cambiar la base URL aquí si es necesario
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return instance;
};

export default axiosToken;
