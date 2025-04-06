import axios from 'axios';

const axiosToken = () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.log('No se encontró token de autenticación.');
    return null;
  }

  const instance = axios.create({
    baseURL: 'https://backendabp.massalud.org.pe/', // Cambia la URL base si es necesario
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Agregar un interceptor para manejar la renovación del token
  instance.interceptors.response.use(
    response => response,
    async (error) => {
      // Si el error es debido a un token expirado (código 401)
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem('RefreshToken');
          if (refreshToken) {
            const refreshResponse = await axios.post('https://backendabp.massalud.org.pe/refresh-token', {
              refresh_token: refreshToken,
            });

            const newAccessToken = refreshResponse.data.access_token;
            localStorage.setItem('authToken', newAccessToken);

            // Reintentar la solicitud original con el nuevo token
            error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(error.config);
          }
        } catch (refreshError) {
          console.error('Error al renovar el token', refreshError);
          // Aquí puedes redirigir al login si el refresh token no es válido
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosToken;
