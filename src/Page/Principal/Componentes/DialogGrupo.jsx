import axios from 'axios';
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'

export default function DialogGrupo({Visible,Close,Actualizar}) {
    const [datos, setDatos] = useState({
        nombre:''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos({ ...datos, [name]: value });
    };

    const hadleSubmit =async()=>{
        try {
            const response = await axios.post('http://localhost:4000/CreateGrupo',datos);
            console.log(response);
            setDatos({
                nombre:''
            });
            Actualizar();
            Close(); 
            
        } catch (error) {
            console.log('error');
            
        } 
    }
  return (
    <div>
        <Dialog visible={Visible} onHide={Close} header='Agregar Grupo'>
            <div className='flex flex-column'>
                <strong>Nombre</strong>
                <InputText placeholder='Ingresar nombre...' value={datos.nombre} name='nombre' onChange={handleChange}/>
            </div>
            <div className='flex justify-content-between mt-3'>
                <Button label='Cancelar' onClick={Close}/>
                <Button label='Aceptar' onClick={hadleSubmit}/>
            </div>
        </Dialog>
    </div>
  )
}
