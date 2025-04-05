import axios from 'axios';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import axiosToken from '../Herramientas/AxiosToken';

export default function FormulalarioTien({ Back, Next, datos, setDatos }) {
    const [distritos, setDistritos] = useState([]);

    const fetchDistritos = async () => {
        const axiosInstance = axiosToken();

        if (!axiosInstance) {
            return;
        }
        try {
            const response = await axiosInstance.get(`/distritos`);
            setDistritos(response.data);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        fetchDistritos();
    }, []);

    const handleLocalChange = (e, field) => {
        // Guardamos solo el id del distrito seleccionado
        setDatos({ ...datos, [field]: e.value.id }); // Ahora solo guardamos el id
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Si el campo es 'ruc', convertimos el valor a un número
        if (name === 'ruc') {
            setDatos({ ...datos, [name]: Number(value) });
        } else {
            setDatos({ ...datos, [name]: value });
        }
    };
    

    const handleSubmit = () => {
        console.log('datos', datos);  // Solo el id del distrito será mostrado
        Next();
    };

    const districtValueTemplate = (option) => {
        // Muestra solo el nombre del distrito
        return <span>{option ? option.nombre : 'Seleccionar distrito'}</span>;
    };

    const districtItemTemplate = (option) => {
        // Muestra solo el nombre del distrito en cada opción
        return <div>{option.nombre}</div>;
    };

    return (
        <div className='flex flex-column'>
            <div className='flex flex-column'>
                <strong>Ruc(Opcional)</strong>
                <InputText
                    name='ruc'
                    onChange={handleChange}
                    value={datos.ruc}
                    placeholder='Ingrese su ruc...'
                />
            </div>
            <div className='flex flex-column'>
                <strong>Nombre de bodega</strong>
                <InputText
                    name='nombreBodega'
                    onChange={handleChange}
                    value={datos.nombreBodega}
                    placeholder='Ingrese su nombre de tienda...'
                />
            </div>
            <div className='flex flex-column'>
                <strong>Distrito</strong>
                <Dropdown
                    options={distritos}
                    optionLabel='nombre'
                    onChange={(e) => handleLocalChange(e, 'distritoId')}
                    placeholder='Seleccione distrito...'
                    value={distritos.find(d => d.id === datos.distritoId)} // Asignamos el objeto completo basado en el id
                    filter
                    valueTemplate={districtValueTemplate} // Personalizamos cómo se muestra el valor seleccionado
                    itemTemplate={districtItemTemplate} // Personalizamos cómo se muestra cada opción
                />
            </div>
            <div className='flex flex-column'>
                <strong>Direccion</strong>
                <InputText
                    name='direccion'
                    onChange={handleChange}
                    value={datos.direccion}
                    placeholder='Ingrese su direccion...'
                />
            </div>
            <div className='flex flex-column'>
                <strong>Referencia</strong>
                <InputText
                    name='referencia'
                    onChange={handleChange}
                    value={datos.referencia}
                    placeholder='Ingrese su correo...'
                />
            </div>
            <div className='flex pt-4 justify-content-between'>
                <Button label='Regresar' severity="info" icon='pi pi-arrow-left' onClick={Back} />
                <Button className="p-button-success p-button-base"  label='Siguiente' iconPos='right' icon='pi pi-arrow-right' onClick={handleSubmit} />
            </div>
        </div>
    );
}
