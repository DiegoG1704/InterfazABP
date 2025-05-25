import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import axiosToken from '../Herramientas/AxiosToken';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import CustomDialog from '../../../components/Dialog/CustomDialog';

export default function DialogDistrito({ Visible, Close, Actualizar }) {
    const [datos, setDatos] = useState({
        nombre: '',
        departamento: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos({ ...datos, [name]: value });
    };

    const toast = useRef(null);
    const handleSubmit =async()=>{
        const axiosInstance = axiosToken();

        if (!axiosInstance) {
            return;
        }
        try {
            const response = await axiosInstance.post(`/CreateDistrito`,datos);
            toast.current.show({
                severity: 'success',
                summary: 'Registro exitoso',
                detail: 'El afiliado fue registrado correctamente',
                life: 3000
            });
            setDatos({
                nombre:'',departamento:'',
            });
            Actualizar();
            Close(); 
        } catch (error) {
            console.log('error');
            const errorMsg = error.response?.data?.error || 'Ocurrió un error al registrar al usuario.';
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMsg,
                life: 5000
            });
        }
        
    }

    return (
        <CustomDialog visible={Visible} onhide={Close} title={"Agregar Distrito"} style={{ width: '30vw' }}  footer={<></>} iconClassName="pi pi-map-marker"> 
            <Toast ref={toast} />
            <div className="p-4 flex flex-column gap-3">
                <div>
                    <label htmlFor="nombre" className="block text-lg font-semibold mb-1">
                        Distrito o Provincia
                    </label>
                    <InputText
                        id="nombre"
                        placeholder="Ingresar distrito..."
                        value={datos.nombre}
                        name="nombre"
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="departamento" className="block text-lg font-semibold mb-1">
                        Departamento
                    </label>
                    <InputText
                        id="departamento"
                        placeholder="Ingresar departamento..."
                        value={datos.departamento}
                        name="departamento"
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>

                <div className="flex justify-content-end gap-2 pt-3">
                    <Button label="Cancelar" className="p-button-secondary" onClick={Close} />
                    <Button label="Aceptar" className="p-button-primary" onClick={handleSubmit} />
                </div>
            </div>
        </CustomDialog>
    );
}
