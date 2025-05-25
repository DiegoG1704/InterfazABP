import { axiosTokenInstance } from "../../../Page/Principal/Herramientas/AxiosToken";
import { mapDebtData } from "../mapper/debtMapper";



export const getAffiliatesToPayment = async (paymentData) => {
    const response = await axiosTokenInstance.get('/UltimoPago', paymentData);
    return response.data;
};

export const getPaymentAffiliate = async (id) => {
    const response = await axiosTokenInstance.get(`/getFechPago/${id}`);
    return response.data;
};
export const getDebtAffiliate = async (id) => {
    const response = await axiosTokenInstance.get(`/deudas/${id}`);
   
    return response.data;
};
export const postPayDebt = async (id, data) => {
    try {
        console.log("data", data)
        const response = await axiosTokenInstance.post(`/postPago/${id}`, data);
        return { data: response.data, status: response.status };
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return { data: [{ message: error.response.data?.mensaje }], status: error.response.status };

    }

};


