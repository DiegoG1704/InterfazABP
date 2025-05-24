import { Button } from 'primereact/button'
import Wave from './components/Wave'
import "./LoginPage.css"
import LogoEmpresa from "../../../assets/auth/sign-in/Logo-ABP.png"
import Background from "../../../assets/auth/sign-in/picture-sign-in.jpg"
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from './store/authSlice'
import { showToast } from '../../../utils/showToast'
import { Toast } from 'primereact/toast'

const LoginPage = () => {
    const [user, setUser] = useState({
        usuario: "", contraseña: ""
    })
    const dispatch = useDispatch();
    const toastRef = useRef(null);
    const handleLogin = async () => {
        const response = await dispatch(login({ usuario: user.usuario, contraseña: user.contraseña }));
        console.log("response", response);
        if (!response?.isValid) {
            showToast("error", "Error", "Ingresar datos correctamente", toastRef)
        }

    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }

    return (
        <div className="login-container">
            <Toast ref={toastRef} position="top-right" />
            <Wave className="wave-bottom-right" />
            <Wave className="wave-top-left" />
            <div className="login-card">
                <div className="login-form-container">
                    <div className="logo-container">
                        <img src={LogoEmpresa} width={200} alt="logo de la empresa" />
                    </div>


                    <div className="form-wrapper">
                        <div className="form-content">
                            <div className="form-header">
                                <h2 className="form-title-small">Impulsa el cambio</h2>
                                <h1 className="form-title-large">Iniciar Sesión</h1>
                            </div>
                            <div className="form-fields">
                                <div className="form-group">
                                    <label htmlFor="username" className="form-label">
                                        Usuario
                                    </label>
                                    <input placeholder="Ingrese su usuario" className="form-input" name="usuario" value={user?.usuario} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contraseña" className="form-label">
                                        Contraseña
                                    </label>
                                    <input className="form-input" placeholder="Ingrese su contraseña" type="password" name="contraseña" value={user?.contraseña} onChange={handleChange} />
                                </div>
                                <div className="form-button-container">
                                    <Button className="login-button" onClick={handleLogin}>Ingresar</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="image-container">
                    <div className="image-wrapper">
                        <img src={Background} alt="logo de la empresa" className="login-image" />
                        <div className="layer"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
