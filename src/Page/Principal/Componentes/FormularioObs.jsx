import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DialogGrupo from './DialogGrupo';
import DialogMetodo from './DialogMetodo';

export default function FormularioObs({ Back, Close, datos, setDatos,Actualizar }) {

    const [distritos, setDistritos] = useState([]);
    const [Metodos, setMetodos] = useState([]);
    const[grupo,setGrupo]=useState(false)
    const[metodo,setMetodo]=useState(false)

    const fetchMetodos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/getMetodo');
            setMetodos(response.data);
        } catch (error) {
            console.log('error', error);
        }
    }

    const fetchDistritos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/getGrupos');
            setDistritos(response.data);
        } catch (error) {
            console.log('error', error);
        }
    }

    useEffect(() => {
        fetchDistritos();
        fetchMetodos();
    }, []);

    const EstadoWhats = [
        { name: 'Si', id: 1 },
        { name: 'No', id: 2 },
        { name: 'no definido', id: 3 },
    ];

    const handleLocalChange = (e, field) => {
        // Guardamos solo el id en lugar del objeto completo
        setDatos({ ...datos, [field]: e.value.id });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos({ ...datos, [name]: value });
    };

    const handleSubmit = async() => {
        console.log('datos', datos);
        try {
            const response = await axios.post('http://localhost:4000/CreateUsuario',datos)
            console.log(response);
            setDatos({
                dni: '',
                nombre: '',
                apellido: '',
                telefono: '',
                correo: '',
                ruc: '',
                nombreBodega: '',
                distrito: '',
                direccionId: '',
                referencia: '',
                metodoAfiliacion: '',
                estadoWhatsapp: '',
                estadoGrupo: '',
                observaciones: '',
            });
            Close();
            Actualizar();
        } catch (error) {
            console.log('error',error);
        }
        
    };

    return (
        <div className='flex flex-column'>
            <div className='flex flex-column m-2'>
                <strong>Metodo de afiliacion</strong>
                <div>
                    <Dropdown
                        value={Metodos.find(m => m.id === datos.metodoAfiliacion)}  // Aquí buscamos el objeto completo
                        onChange={(e) => handleLocalChange(e, 'metodoAfiliacion')}
                        options={Metodos}
                        optionLabel="nombre"
                        placeholder="Seleccione metodo..."
                        filter
                    />
                    <Button label='Agregar' onClick={()=>setMetodo(true)}/>
                </div>
            </div>
            <div className='flex flex-column m-2'>
                <strong>Estado de WhatsApp</strong>
                <Dropdown
                    value={EstadoWhats.find(w => w.id === datos.estadoWhatsapp)}  // Aquí buscamos el objeto completo
                    onChange={(e) => handleLocalChange(e, 'estadoWhatsapp')}
                    options={EstadoWhats}
                    optionLabel="name"
                    placeholder="Seleccione estado..."
                    filter
                />
            </div>
            <div className='flex flex-column m-2'>
                <strong>Grupo</strong>
                <div className='flex'>
                    <Dropdown
                        value={distritos.find(d => d.id === datos.estadoGrupo)}  // Aquí buscamos el objeto completo
                        onChange={(e) => handleLocalChange(e, 'estadoGrupo')}
                        options={distritos}
                        optionLabel="nombre"
                        placeholder="Seleccione grupo..."
                    />
                    <Button label='Agregar' onClick={()=>setGrupo(true)}/>
                </div>
            </div>
            <div className='flex flex-column m-2'>
                <strong>Observacion</strong>
                <InputTextarea
                    placeholder='Ingrese observacion...'
                    value={datos.observaciones || ''}
                    name="observaciones"
                    onChange={handleChange}
                />
            </div>
            <div className="flex pt-4 justify-content-between m-2">
                <Button label="Regresar" severity="secondary" icon="pi pi-arrow-left" onClick={Back} />
                <Button label="Agregar" iconPos="right" onClick={handleSubmit} />
            </div>

            <DialogGrupo
            Visible={grupo}
            Close={()=>setGrupo(false)}
            Actualizar={fetchDistritos}
            />
            <DialogMetodo
            Visible={metodo}
            Close={()=>setMetodo(false)}
            Actualizar={fetchMetodos}
            />
        </div>
    );
}
