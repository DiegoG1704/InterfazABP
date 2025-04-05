// axiosUser.js
import axiosToken from './AxiosToken';

const axiosUser = () => {
    const axiosInstance = axiosToken();

    if (!axiosInstance) {
        throw new Error('No se pudo crear la instancia de Axios debido a la falta de un token');
    }

    return axiosInstance;
};

export default axiosUser;
