import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea'
import axiosToken from '../Herramientas/AxiosToken';
import DialogGrupo from './DialogGrupo';
import DialogMetodo from './DialogMetodo';
import { Toast } from 'primereact/toast';

export default function DialogObservaciones({Visible,Close,Datos,SetDatos,Actualizar}) {
  const[grupo,setGrupo]=useState(false)
  const[metodo,setMetodo]=useState(false)
  const [isEditable, setIsEditable] = useState({
      estadoGrupo: false,
      metodoAfiliacion:false,
      observaciones:false,
    });
    const [editingField, setEditingField] = useState(null);
      // Función para habilitar un campo en específico
    const enableField = (field) => {
      setIsEditable((prev) => ({
        ...prev,
        [field]: true,
      }));
      setEditingField(field);  // Establecemos el campo en modo edición
    };

  const [distritos, setDistritos] = useState([]);
    const [Metodos, setMetodos] = useState([]);

    const fetchMetodos = async () => {
      const axiosInstance = axiosToken();

      if (!axiosInstance) {
          return;
      }
        try {
            const response = await axiosInstance.get(`/getMetodo`);
            setMetodos(response.data);
        } catch (error) {
            console.log('error', error);
        }
    }

    const fetchDistritos = async () => {
      const axiosInstance = axiosToken();

      if (!axiosInstance) {
          return;
      }
        try {
            const response = await axiosInstance.get(`/getGrupos`);
            setDistritos(response.data);
        } catch (error) {
            console.log('error', error);
        }
    }

    useEffect(() => {
        fetchDistritos();
        fetchMetodos();
    }, []);

    const handleInputChange = (e, field) => {
      const { value } = e.target;
    
      // Si el campo es 'estadoGrupo' o 'metodoAfiliacion', solo asignamos el 'id'
      if (field === 'estadoGrupo') {
        SetDatos((prev) => ({
          ...prev,
          estadoGrupo: value,  // Solo asignamos el 'id' de la opción seleccionada
        }));
      } else if (field === 'metodoAfiliacion') {
        SetDatos((prev) => ({
          ...prev,
          metodoAfiliacion: value,  // Solo asignamos el 'id' de la opción seleccionada
        }));
      } else {
        // Para otros campos, simplemente asignamos el valor
        SetDatos((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    };
    const toast = useRef(null);
    const saveChanges = async (field) => {
      const campoYValor = {
        campo: field,
        valor: field === 'estadoGrupo' ? Datos.estadoGrupo : 
              field === 'metodoAfiliacion' ? Datos.metodoAfiliacion : Datos[field], 
      };

      const axiosInstance = axiosToken();

      if (!axiosInstance) {
          return;
      }
      try {
        const response = await axiosInstance.patch(`/editCampo/${Datos.id}`, campoYValor);
        toast.current.show({
          severity: 'success',
          summary: 'Actualizacion exitosa',
          detail: 'Exito al actualizar campo',
          life: 3000
      });
        setIsEditable((prev) => ({
          ...prev,
          [field]: false,
        }));
        setEditingField(null);
        Actualizar(); // Actualizamos el estado
      } catch (error) {
        console.log('error', error);
        const errorMsg = error.response?.data?.error || 'Ocurrió un error al registrar al usuario.';
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg,
            life: 5000
        });
      }
    };
    
    
  return (
    <div>
        <Dialog visible={Visible} onHide={Close} header='Observaciones'>
          <Toast ref={toast} />
            <div className='flex flex-column'>
              <div className='flex flex-column'>
                <strong>Grupo</strong>
                <div className="flex">
                <Dropdown
                  name='estadoGrupo' 
                  value={Datos.estadoGrupo}  // Solo asignamos el 'id', no el objeto completo
                  onChange={(e) => handleInputChange(e, 'estadoGrupo')}
                  options={distritos}
                  style={{width:'10rem'}}
                  optionLabel="nombre"  // Mostrar el 'nombre' del grupo
                  optionValue="id"  // Enviar solo el 'id' de la opción seleccionada
                  placeholder="Seleccione grupo..."
                  disabled={!isEditable.estadoGrupo} 
                  filter
                />
                <Button onClick={()=>setGrupo(true)} className="p-button-text"><i className="pi pi-plus-circle" style={{ color: '#6ba4c7',fontSize:'1.5rem' }}></i></Button>

                  {editingField !== 'estadoGrupo' ? (
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-text"
                      style={{ color: '#e3cb42' }}
                      onClick={() => enableField('estadoGrupo')}
                    />
                  ) : (
                    <Button
                      icon="pi pi-save"
                      className="p-button-text"
                      style={{ color: '#6ba4c7' }}
                      onClick={() => saveChanges('estadoGrupo')}
                    />
                  )}
                </div>
              </div>
              <div className='flex flex-column'>
                <strong>Metodo de Afiliacion</strong>
                <div className="flex">
                <Dropdown
                    name='metodoAfiliacion'
                    optionLabel="nombre"
                    optionValue="id"  // Enviar solo el 'id' de la opción seleccionada
                    style={{width:'10rem'}}
                    value={Datos.metodoAfiliacion}  // Aquí buscamos el objeto completo
                    onChange={(e) => handleInputChange(e, 'metodoAfiliacion')}
                    options={Metodos}
                    placeholder="Seleccione metodo..."
                    disabled={!isEditable.metodoAfiliacion} 
                    filter
                />
                <Button onClick={()=>setMetodo(true)} className="p-button-text"><i className="pi pi-plus-circle" style={{ color: '#6ba4c7',fontSize:'1.5rem' }}></i></Button>
                {editingField !== 'metodoAfiliacion' ? (
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-text"
                      style={{ color: '#e3cb42' }}
                      onClick={() => enableField('metodoAfiliacion')}
                    />
                  ) : (
                    <Button
                      icon="pi pi-save"
                      className="p-button-text"
                      style={{ color: '#6ba4c7' }}
                      onClick={() => saveChanges('metodoAfiliacion')}
                    />
                  )}
              </div>
              </div>
              <div className='flex flex-column'>
              <strong>Observaciones</strong>
              <div className="flex">
                <InputTextarea 
                name='observaciones'
                value={Datos.observaciones}
                disabled={!isEditable.observaciones} 
                onChange={(e) => handleInputChange(e, 'observaciones')}
                style={{height:'10rem',width:'14rem'}}
                />
                {editingField !== 'observaciones' ? (
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-text"
                      style={{ color: '#e3cb42' }}
                      onClick={() => enableField('observaciones')}
                    />
                  ) : (
                    <Button
                      icon="pi pi-save"
                      className="p-button-text"
                      style={{ color: '#6ba4c7' }}
                      onClick={() => saveChanges('observaciones')}
                    />
                  )} 
              </div>
              </div>
            </div>  
        </Dialog>
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
  )
}
