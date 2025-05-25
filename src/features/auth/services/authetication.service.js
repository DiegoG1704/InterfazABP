
import AxiosServices from "../../../helper/http-common";

export class AuthenticationServices {
    async signIn(credentials) {
        try {
            // const axiosInstance = getAxiosInstance();
            const response = await AxiosServices.httpInstance.post("/login", credentials)
            console.log("response-inicial", response);


            return { data: response.data, status: response.status ,success:true};
        } catch (error) {
            return { data: [{ message: error.response.data?.mensaje }], status: error.response.status,success:false };
        }

    }

}