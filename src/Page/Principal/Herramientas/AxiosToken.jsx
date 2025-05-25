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
      if (error.response && error.response.status === 400) {
        try {
          const refreshToken = localStorage.getItem('RefreshToken');
          if (refreshToken) {
            // Intentar renovar el token de acceso con el refresh token
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
          // Si no se puede renovar el token, redirigir al login
          window.location.href = '/login';  // Aquí puedes redirigir al login o mostrar un mensaje al usuario
        }
      }

      // Si el error no es 401 o no se pudo manejar, rechazamos la promesa con el error original
      return Promise.reject(error);
    }
  );

  return instance;
};
const axiosTokenInstance = axiosToken();

export default axiosToken;
export {axiosTokenInstance}
