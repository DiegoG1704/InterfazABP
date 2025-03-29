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

    const handleCodigoChange = (e) => {
        const { value } = e.target;
        
        // Asegúrate de que solo sean números y de que tenga exactamente 4 dígitos
        if (/^\d{0,4}$/.test(value)) {  // Expresión regular que permite solo números y hasta 4 cifras
            setDatos({ ...datos, codigo: value });  // Si la validación es correcta, actualizamos el estado
        }
    };
    

    return (
        <div className='p-fluid'>
            <div className='p-grid p-align-center'>
            <div className='p-mb-4'>
                <label htmlFor="nombre"><strong>Código</strong></label>
                <InputText 
                    id="codigo"
                    placeholder='Ingrese el código...'
                    name='codigo'
                    value={datos.codigo}
                    onChange={(e) => handleCodigoChange(e)}  // Llamar a la función handleCodigoChange
                    className="p-inputtext-base"
                    maxLength={4}  // Limitar a 4 caracteres
                />
            </div>

                <div className='p-col-12 p-md-6'>
                    <div className='p-mb-4'>
                        <label htmlFor="dni"><strong>DNI</strong></label>
                        <div className="p-inputgroup">
                            <InputText 
                                id="dni"
                                placeholder='Ingrese su DNI...'
                                name='dni'
                                value={datos.dni}
                                onChange={handleChange}
                                maxLength={8}
                                className="p-inputtext-base" 
                            />
                            <Button 
                                label={loading ? 'Cargando...' : 'Completar'} 
                                onClick={completarDatos} 
                                disabled={loading} 
                                className="p-button-primary p-button-base p-inputtext-base" 
                                severity='info'
                            />
                        </div>
                    </div>
                </div>

                <div className='p-col-12 p-md-6'>
                    <div className='p-mb-4'>
                        <label htmlFor="nombre"><strong>Nombre</strong></label>
                        <InputText 
                            id="nombre"
                            placeholder='Ingrese su nombre...'
                            name='nombre'
                            value={datos.nombre}
                            onChange={handleChange}
                            className="p-inputtext-base"
                        />
                    </div>
                </div>

                <div className='p-col-12 p-md-6'>
                    <div className='p-mb-4'>
                        <label htmlFor="apellido"><strong>Apellido</strong></label>
                        <InputText 
                            id="apellido"
                            placeholder='Ingrese su apellido...'
                            name='apellido'
                            value={datos.apellido}
                            onChange={handleChange}
                            className="p-inputtext-base"
                        />
                    </div>
                </div>

                <div className='p-col-12 p-md-6'>
                    <div className='p-mb-4'>
                        <label htmlFor="telefono"><strong>Teléfono</strong></label>
                        <InputText 
                            id="telefono"
                            placeholder='Ingrese su teléfono...'
                            name='telefono'
                            value={datos.telefono}
                            onChange={handleChange}
                            className="p-inputtext-base"
                        />
                    </div>
                </div>

                <div className='p-col-12 p-md-6'>
                    <div className='p-mb-4'>
                        <label htmlFor="correo"><strong>Correo</strong></label>
                        <InputText 
                            id="correo"
                            placeholder='Ingrese su correo...'
                            name='correo'
                            value={datos.correo}
                            onChange={handleChange}
                            className="p-inputtext-base"
                        />
                    </div>
                </div>
            </div>

            <div className="p-d-flex p-jc-end mt-3">
                <Button 
                    label="Siguiente" 
                    icon="pi pi-arrow-right" 
                    iconPos="right" 
                    onClick={Next} 
                    className="p-button-success p-button-base" 
                />
            </div>

        </div>
    );
}
