import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useState, useEffect } from 'react';

export default function DialogPersonal({ Visible, Close, Datos, Actualizar }) {
    // Usamos un efecto para actualizar los datosP cuando los datos cambian desde el componente padre.
    const [datosP, setDatosP] = useState({
        dni: Datos.dni,
        ruc: Datos.ruc,
        nombre: Datos.nombre,
        apellido: Datos.apellido,
    });

    // Actualizamos los datosP si los Datos cambian (cuando el diálogo se vuelve a abrir)
    useEffect(() => {
        setDatosP({
            dni: Datos.dni,
            ruc: Datos.ruc,
            nombre: Datos.nombre,
            apellido: Datos.apellido,
        });
    }, [Datos]);  // Solo se ejecutará cuando Datos cambie.

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosP({ ...datosP, [name]: value });
    };

    const handleAccept = async () => {
        try {
            // Enviamos los datos editados al servidor usando axios
            const response = await axios.patch(`http://localhost:4000/editPersonal/${Datos?.id}`, datosP);

            // Llamamos a la función Actualizar para refrescar la vista
            Actualizar();

            // Cerramos el diálogo y reseteamos los datosP
            Close();
        } catch (error) {
            console.log('Error al actualizar los datos:', error);
        }
    };

    return (
        <div>
            <Dialog visible={Visible} onHide={Close} header='Editar Datos'>
                <div className='flex flex-column'>
                    {/* Campos de entrada para DNI, RUC, Nombre y Apellido */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong>DNI</strong>
                        <InputText
                            placeholder='Ingrese su DNI..'
                            name="dni"
                            value={datosP.dni}
                            onChange={handleChange} // Actualiza el estado al cambiar el valor
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong>Ruc</strong>
                        <InputText
                            placeholder='Ingrese ruc...'
                            name="ruc"
                            value={datosP.ruc}
                            onChange={handleChange} // Actualiza el estado al cambiar el valor
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong>Nombre</strong>
                        <InputText
                            placeholder='Ingrese nombre...'
                            name="nombre"
                            value={datosP.nombre}
                            onChange={handleChange} // Actualiza el estado al cambiar el valor
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong>Apellido</strong>
                        <InputText
                            placeholder='Ingrese apellido...'
                            name="apellido"
                            value={datosP.apellido}
                            onChange={handleChange} // Actualiza el estado al cambiar el valor
                        />
                    </div>
                </div>
                <div className='flex justify-content-between mt-2'>
                    <Button label='Cancelar' onClick={Close} />
                    <Button label='Aceptar' onClick={handleAccept} />
                </div>
            </Dialog>
        </div>
    );
}
