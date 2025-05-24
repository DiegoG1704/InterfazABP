

import { AuthenticationServices } from '../../services/authetication.service';
import { loginSchema } from '../validator/loginValidator';


export async function loginUser(data) {
    const validated = loginSchema.safeParse(data);
  
    if (!validated.success) {
      return {
        data: {},
        status: 400,
        success: false,
        error:validated.error.issues,
        isValid:false,
      };
    }
  
    const service = new AuthenticationServices();
    const response = await service.signIn(data);
    console.log("response", response);
  
    if (response.success) {
      return {
        data: response.data,
        status: response.status,
        success: true,
        isValid:true,
      };
    }
  
    // ⚠️ Asegúrate de devolver algo si el status no es 200
    return {
      data: response.data,
      status: response.status,
      success: false,
      message: response.data?.message || "Login fallido",
      isValid:false,
    };
  }
  