import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import axios from 'axios';

export default function FomularioPers({ Next, datos, setDatos }) {
    const [loading, setLoading] = useState(false); // Estado para manejar la carga de la API

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Evitar caracteres no numéricos en el campo DNI
        if (name === 'dni' && !/^\d*$/.test(value)) return;
        setDatos({ ...datos, [name]: value });
    };

    const completarDatos = async () => {
        if (!datos.dni || datos.dni.length !== 8) {
            alert("Ingrese un DNI válido (8 dígitos)");
            return;
        }
    
        setLoading(true); // Iniciar carga
    
        try {
            const response = await axios.get(
                `https://api.perudevs.com/api/v1/dni/simple?document=${datos.dni}&key=cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjc1OWM1MWU5ZmE0MTczZjYxMzIwNTY0`
            );
    
            if (response.data.estado && response.data.resultado) {
                const { nombres, apellido_paterno, apellido_materno } = response.data.resultado;
                setDatos({
                    ...datos,
                    nombre: nombres || '',
                    apellido: `${apellido_paterno || ''} ${apellido_materno || ''}`.trim()
                });
            } else {
                alert("No se encontraron datos para el DNI ingresado.");
            }
        } catch (error) {
            console.error("Error al buscar el DNI:", error);
            alert("Error al consultar la API. Intente nuevamente.");
        } finally {
            setLoading(false); // Finalizar carga
        }
    };
    

    return (
        <div className='flex flex-column'>
            <div className='flex flex-column m-2 '>
                <strong>DNI</strong>
                <div className='flex w-full'>
                    <InputText 
                        placeholder='Ingrese su DNI...'
                        name='dni'
                        value={datos.dni}
                        onChange={handleChange}
                        maxLength={8} // Limitar a 8 caracteres
                    />
                    <Button label='Completar' onClick={completarDatos} disabled={loading} />
                </div>
            </div>
            <div className='flex flex-column m-2'>
                <strong>Nombre</strong>
                <InputText 
                    placeholder='Ingrese su nombre...'
                    name='nombre'
                    value={datos.nombre}
                    onChange={handleChange}
                />
            </div>
            <div className='flex flex-column m-2'>
                <strong>Apellido</strong>
                <InputText 
                    placeholder='Ingrese su apellido...'
                    name='apellido'
                    value={datos.apellido}
                    onChange={handleChange}
                />
            </div>
            <div className='flex flex-column m-2'>
                <strong>Teléfono</strong>
                <InputText 
                    placeholder='Ingrese su teléfono...'
                    name='telefono'
                    value={datos.telefono}
                    onChange={handleChange}
                />
            </div>
            <div className='flex flex-column m-2'>
                <strong>Correo</strong>
                <InputText 
                    placeholder='Ingrese su correo...'
                    name='correo'
                    value={datos.correo}
                    onChange={handleChange}
                />
            </div>
            <div className="flex justify-content-end m-2">
                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={Next} />
            </div>
        </div>
    );
}
