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
        const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No se encontró token de autenticación.");
      return;
    }
        try {
            const response = await axios.get(`https://backendabp.massalud.org.pe/getMetodo`,{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            setMetodos(response.data);
        } catch (error) {
            console.log('error', error);
        }
    }

    const fetchDistritos = async () => {
        const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No se encontró token de autenticación.");
      return;
    }
        try {
            const response = await axios.get(`https://backendabp.massalud.org.pe/getGrupos`,{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
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

    const handleSubmit = async () => {
        const token = localStorage.getItem("authToken");
    
        if (!token) {
            console.log("No se encontró token de autenticación.");
            return;
        }
    
        try {
            // const datosConRuc = {
            //     ...datos,
            //     ruc: typeof datos.ruc === 'string' ? datos.ruc.trim() : 'Sin RUC', // Verifica si ruc es un string antes de usar trim()
            // };
    
            const response = await axios.post(`https://backendabp.massalud.org.pe/CreateUsuario`, datos, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log(response);
    
            // Limpiar los datos después de enviar
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
                codigo: '',
            });
    
            Close();  // Cierra el formulario o el modal
            Actualizar();  // Actualiza el estado o la vista
        } catch (error) {
            console.log('error', error);
        }
    };
    
    

    return (
        <div className='flex flex-column'>
            <div className='flex flex-column'>
                <strong>Metodo de afiliacion</strong>
                <div className='p-inputgroup'>
                    <Dropdown
                        value={Metodos.find(m => m.id === datos.metodoAfiliacion)}  // Aquí buscamos el objeto completo
                        onChange={(e) => handleLocalChange(e, 'metodoAfiliacion')}
                        options={Metodos}
                        optionLabel="nombre"
                        placeholder="Seleccione metodo..."
                        className="p-inputtext-base"
                        filter
                    />
                    <Button label='Agregar' onClick={()=>setMetodo(true)} className="p-button-primary p-button-base p-inputtext-base" severity='info'/>
                </div>
            </div>
            <div className='flex flex-column'>
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
            <div className='flex flex-column'>
                <strong>Grupo</strong>
                <div className='p-inputgroup'>
                    <Dropdown
                        value={distritos.find(d => d.id === datos.estadoGrupo)}  // Aquí buscamos el objeto completo
                        onChange={(e) => handleLocalChange(e, 'estadoGrupo')}
                        options={distritos}
                        optionLabel="nombre"
                        placeholder="Seleccione grupo..."
                        className="p-inputtext-base"
                        filter
                    />
                    <Button label='Agregar' onClick={()=>setGrupo(true)} className="p-button-primary p-button-base p-inputtext-base" severity="info"/>
                </div>
            </div>
            <div className='flex flex-column'>
                <strong>Observacion</strong>
                <InputTextarea
                    placeholder='Ingrese observacion...'
                    value={datos.observaciones || ''}
                    name="observaciones"
                    onChange={handleChange}
                />
            </div>
            <div className="flex pt-4 justify-content-between">
                <Button label="Regresar" severity="info" icon="pi pi-arrow-left" onClick={Back} />
                <Button label="Agregar" iconPos="right" onClick={handleSubmit} className="p-button-success p-button-base" />
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
