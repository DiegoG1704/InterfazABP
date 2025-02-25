import axios from 'axios';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';

export default function FormulalarioTien({ Back, Next, datos, setDatos }) {
    const [distritos, setDistritos] = useState([]);

    const fetchDistritos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/distritos');
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
        setDatos({ ...datos, [name]: value });
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
            <div className='flex flex-column m-2'>
                <strong>Ruc</strong>
                <div className='flex w-full'>
                    <InputText
                        name='ruc'
                        onChange={handleChange}
                        value={datos.ruc}
                        placeholder='Ingrese su ruc...'
                    />
                    <Button label='Completar' />
                </div>
            </div>
            <div className='flex flex-column m-2'>
                <strong>Nombre de bodega</strong>
                <InputText
                    name='nombreBodega'
                    onChange={handleChange}
                    value={datos.nombreBodega}
                    placeholder='Ingrese su nombre de tienda...'
                />
            </div>
            <div className='flex flex-column m-2'>
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
            <div className='flex flex-column m-2'>
                <strong>Direccion</strong>
                <InputText
                    name='direccion'
                    onChange={handleChange}
                    value={datos.direccion}
                    placeholder='Ingrese su direccion...'
                />
            </div>
            <div className='flex flex-column m-2'>
                <strong>Referencia</strong>
                <InputText
                    name='referencia'
                    onChange={handleChange}
                    value={datos.referencia}
                    placeholder='Ingrese su correo...'
                />
            </div>
            <div className='flex pt-4 justify-content-between m-2'>
                <Button label='Regresar' severity='secondary' icon='pi pi-arrow-left' onClick={Back} />
                <Button label='Siguiente' iconPos='right' icon='pi pi-arrow-right' onClick={handleSubmit} />
            </div>
        </div>
    );
}
