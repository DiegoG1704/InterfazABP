import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'

export default function FomularioPers({Next,datos,setDatos}) {

      const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos({ ...datos, [name]: value });
      };

  return (
    <div className='flex flex-column'>
        <div className='flex flex-column m-2 '>
            <strong>DNI</strong>
            <div className='flex w-full'>
                <InputText 
                    placeholder='Ingrese su DNI..'
                    name='dni'
                    value={datos.dni}
                    onChange={handleChange}
                    />
                <Button label='Completar' />
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
            <strong>Telefono</strong>
            <InputText 
                placeholder='Ingrese su telefono...'
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
            <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={Next}/>
        </div>
    </div>
  )
}
