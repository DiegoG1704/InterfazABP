import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea'

export default function DialogObservaciones({Visible,Close,Datos,SetDatos,Actualizar}) {
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
    
    const saveChanges = async (field) => {
      const campoYValor = {
        campo: field,
        valor: field === 'estadoGrupo' ? Datos.estadoGrupo : 
              field === 'metodoAfiliacion' ? Datos.metodoAfiliacion : Datos[field], 
      };
    
      try {
        const response = await axios.patch(`http://localhost:4000/editCampo/${Datos.id}`, campoYValor);
        console.log(response.data);
        setIsEditable((prev) => ({
          ...prev,
          [field]: false,
        }));
        setEditingField(null);
        Actualizar(); // Actualizamos el estado
      } catch (error) {
        console.log('error', error);
      }
    };
    
    
  return (
    <div>
        <Dialog visible={Visible} onHide={Close} header='Observaciones'>
            <div className='flex flex-column'>
              <div className='flex flex-column'>
                <strong>Grupo</strong>
                <div className="flex justify-content-between">
                <Dropdown
                  name='estadoGrupo' 
                  value={Datos.estadoGrupo}  // Solo asignamos el 'id', no el objeto completo
                  onChange={(e) => handleInputChange(e, 'estadoGrupo')}
                  options={distritos}
                  style={{width:'100%'}}
                  optionLabel="nombre"  // Mostrar el 'nombre' del grupo
                  optionValue="id"  // Enviar solo el 'id' de la opción seleccionada
                  placeholder="Seleccione grupo..."
                  disabled={!isEditable.estadoGrupo} 
                  filter
                />

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
                <div className="flex justify-content-between">
                <Dropdown
                    name='metodoAfiliacion'
                    optionLabel="nombre"
                    optionValue="id"  // Enviar solo el 'id' de la opción seleccionada
                    style={{width:'100%'}}
                    value={Datos.metodoAfiliacion}  // Aquí buscamos el objeto completo
                    onChange={(e) => handleInputChange(e, 'metodoAfiliacion')}
                    options={Metodos}
                    placeholder="Seleccione metodo..."
                    disabled={!isEditable.metodoAfiliacion} 
                    filter
                />
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
              <div className="flex justify-content-between">
                <InputTextarea 
                name='observaciones'
                value={Datos.observaciones}
                disabled={!isEditable.observaciones} 
                onChange={(e) => handleInputChange(e, 'observaciones')}
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
    </div>
  )
}
