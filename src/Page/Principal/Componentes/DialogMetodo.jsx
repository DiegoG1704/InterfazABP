import axios from 'axios';
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'
import axiosToken from '../Herramientas/AxiosToken';
import CustomDialog from '../../../components/Dialog/CustomDialog';

export default function DialogMetodo({ Visible, Close, Actualizar }) {
    const [datos, setDatos] = useState({
        nombre: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos({ ...datos, [name]: value });
    };

    const hadleSubmit = async () => {
        const axiosInstance = axiosToken();

        if (!axiosInstance) {
            return;
        }
        try {
            const response = await axiosInstance.post(`/CreateMetodo`, datos);
            setDatos({
                nombre: ''
            });
            Actualizar();
            Close();

        } catch (error) {
            console.log('error');

        }

    }
    const footer = (
        <div className='flex justify-content-end'>
            <Button label='Cancelar' onClick={Close} />
            <Button label='Aceptar' onClick={hadleSubmit} />
        </div>
    )
    return (
        <div>
            <CustomDialog visible={Visible} onhide={Close} title='Agregar Metodo' footer={footer} iconClassName={"pi pi-users"}>
                <div className='flex flex-column'>
                    <strong>Nombre</strong>
                    <InputText placeholder='Ingresar nombre...' value={datos.nombre} name='nombre' onChange={handleChange} />
                </div>

            </CustomDialog>
        </div>
    )
}
