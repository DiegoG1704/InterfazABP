import axios from "axios";



export class AxiosAdapter {
    axiosInstance = null;

    constructor(options) {
        console.log("AxiosAdapter", options);
        this.axiosInstance = axios.create({
            baseURL: options.baseURL,
            params: options.params,
            withCredentials: true,
        });
        this.axiosInstance.interceptors.response.use(
            response => response,
            async (error) => {
                // Si el error es debido a un token expirado (código 401)
                if (error.response && error.response.status === 400) {
                    try {
                        const refreshToken = localStorage.getItem('RefreshToken');

                        if (refreshToken) {
                            // Intentar renovar el token de acceso con el refresh token
                            const refreshResponse = await axios.post(`${options?.baseURL}/refresh-token`, {
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
        this.axiosInstance.interceptors.request.use(config => {
            const token = options.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, error => {
            return Promise.reject(error);
        });
    }

    async get(
        url,
        options,
    ) {
        try {
            const { data } = await this.axiosInstance.get(url, options);

            return data;
        } catch (error) {
            console.log("error", error);
            throw new Error(`Error fetching get: ${url} `);
        }
    }
    async post(
        url,
        options
    ) {
        try {
            const { data } = await this.axiosInstance.post(url, options);

            return data;
        } catch (error) {
            console.log("error", error);
            throw new Error(`Error fetching get: ${url} `);
        }
    }
    getInstance() {
        console.log("getInstance", this.axiosInstance);
        return this.axiosInstance;
    }
    // setToken(token) {
    //     this.axiosInstance
    // }
}
