import { AxiosAdapter } from "../config/adapters/axios.adapter";


const getToken = () => {
  const tokenString = localStorage.getItem("authToken")
  return tokenString;
};

const apiUrl = import.meta.env.VITE_BASE_URL;

const httpAdapter = new AxiosAdapter({
  baseURL: apiUrl, // 👈 Asegúrate que sea 'baseURL'
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
  token:getToken()
});

const AxiosServices = {
  getToken,
  setToken: (token) => localStorage.setItem("token", JSON.stringify(token)),
  deleteToken: () => localStorage.removeItem("token"),
  httpInstance: httpAdapter.getInstance(), // 👈 ya devuelves el axios listo
};

export default AxiosServices;
