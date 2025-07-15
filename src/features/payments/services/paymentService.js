import AxiosServices from "../../../helper/http-common";
import { axiosTokenInstance } from "../../../Page/Principal/Herramientas/AxiosToken";
import { mapDebtData } from "../mapper/debtMapper";



export const getAffiliatesToPayment = async (paymentData) => {
    const response = await AxiosServices.httpInstance.get('/UltimoPago', paymentData);
    return response.data;
};

export const getPaymentAffiliate = async (id) => {
    const response = await AxiosServices.httpInstance.get(`/pagos/${id}`);
    return response.data;
};
export const getDebtAffiliate = async (id) => {
    const response = await AxiosServices.httpInstance.get(`/deudas/${id}`);
   
    return response.data;
};
export const postPayDebt = async (id, data) => {
    try {
        console.log("data", data)
        const response = await AxiosServices.httpInstance.post(`/postPago/${id}`, data);
        return { data: response.data, status: response.status };
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return { data: [{ message: error.response.data?.mensaje }], status: error.response.status };

    }

};


