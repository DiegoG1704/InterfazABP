import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';

export default function DialogTienda({ Visible, Close, Datos, SetDatos,Actualizar }) {
  // Creamos el estado para controlar si los campos están habilitados
  const [isEditable, setIsEditable] = useState({
    nombreBodega: false,
    direccion: false,
    distritoId: false,
    correo: false,
  });

  // Estado para controlar si estamos en modo edición para cada campo
  const [editingField, setEditingField] = useState(null);

  // Función para habilitar un campo en específico
  const enableField = (field) => {
    setIsEditable((prev) => ({
      ...prev,
      [field]: true,
    }));
    setEditingField(field);  // Establecemos el campo en modo edición
  };

  // Función para guardar los cambios y desactivar el modo edición en el campo correspondiente
  const saveChanges = async (field) => {
    const campoYValor = {
      campo: field,
      valor: field === 'distritoId' ? Datos.distritoId : Datos[field], // Solo enviamos el 'id' si es 'distritoId'
    };

    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No se encontró token de autenticación.");
      return;
    }
  
    try {
      const response = await axios.patch(`http://localhost:3000/editCampo/${Datos.id}`, campoYValor,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setIsEditable((prev) => ({
        ...prev,
        [field]: false,
      }));
      setEditingField(null);
      Actualizar();
    } catch (error) {
      console.log('error', error);
    }
  };
  
  
  const [distritos, setDistritos] = useState([]);

    const fetchDistritos = async () => {
      const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No se encontró token de autenticación.");
      return;
    }
        try {
            const response = await axios.get(`http://localhost:3000/distritos`,{
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setDistritos(response.data);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        fetchDistritos();
    }, [Visible,Datos.id]);

    const handleInputChange = (e, field) => {
      const { value } = e.target;
    
      if (field === 'distritoId') {
        SetDatos((prev) => ({
          ...prev,
          distritoId: value,  // Solo asignamos el 'id' al estado
        }));
      } else {
        SetDatos((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    };
    
  

  return (
    <Dialog header="Datos de Tienda" visible={Visible} onHide={Close}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Nombre de Tienda */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>Nombre de Tienda</strong>
          <div className="flex justify-content-between">
            <InputText
              name="nombreBodega"
              value={Datos.nombreBodega}
              disabled={!isEditable.nombreBodega}
              onChange={(e) => handleInputChange(e, 'nombreBodega')} // Agregamos el manejador de cambios
            />
            {editingField !== 'nombreBodega' ? (
              <Button
                icon="pi pi-pencil"
                className="p-button-text"
                style={{ color: '#e3cb42' }}
                onClick={() => enableField('nombreBodega')}
              />
            ) : (
              <Button
                icon="pi pi-save"
                className="p-button-text"
                style={{ color: '#6ba4c7' }}
                onClick={() => saveChanges('nombreBodega')}
              />
            )}
          </div>
        </div>

        {/* Dirección */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>Dirección</strong>
          <div className="flex justify-content-between">
            <InputText
              name="direccion"
              value={Datos.direccion}
              disabled={!isEditable.direccion}
              onChange={(e) => handleInputChange(e, 'direccion')} // Agregamos el manejador de cambios
            />
            {editingField !== 'direccion' ? (
              <Button
                icon="pi pi-pencil"
                className="p-button-text"
                style={{ color: '#e3cb42' }}
                onClick={() => enableField('direccion')}
              />
            ) : (
              <Button
                icon="pi pi-save"
                className="p-button-text"
                style={{ color: '#6ba4c7' }}
                onClick={() => saveChanges('direccion')}
              />
            )}
          </div>
        </div>

        {/* Distrito */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>Distrito</strong>
          <div className="flex justify-content-between">
          <Dropdown
            options={distritos} // Lista de distritos con id y nombre
            optionLabel="nombre" // Mostrar la propiedad "nombre"
            optionValue="id" // Asegurarnos de que solo se pase el 'id' como valor
            name="distritoId"
            style={{width:'100%'}}
            onChange={(e) => handleInputChange(e, 'distritoId')} // Manejador de cambios
            placeholder="Seleccione distrito..."
            value={Datos.distritoId} // Debemos asegurarnos de que el 'value' sea solo el 'id'
            filter
            disabled={!isEditable.distritoId}
          />

            {editingField !== 'distritoId' ? (
              <Button
                icon="pi pi-pencil"
                className="p-button-text"
                style={{ color: '#e3cb42' }}
                onClick={() => enableField('distritoId')}
              />
            ) : (
              <Button
                icon="pi pi-save"
                className="p-button-text"
                style={{ color: '#6ba4c7' }}
                onClick={() => saveChanges('distritoId')}
              />
            )}
          </div>
        </div>

        {/* Correo */}
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          <strong>Correo</strong>
          <div className="flex justify-content-between">
            <InputText
              name="correo"
              value={Datos.correo}
              disabled={!isEditable.correo}
              onChange={(e) => handleInputChange(e, 'correo')} // Agregamos el manejador de cambios
            />
            {editingField !== 'correo' ? (
              <Button
                icon="pi pi-pencil"
                className="p-button-text"
                style={{ color: '#e3cb42' }}
                onClick={() => enableField('correo')}
              />
            ) : (
              <Button
                icon="pi pi-save"
                className="p-button-text"
                style={{ color: '#6ba4c7' }}
                onClick={() => saveChanges('correo')}
              />
            )}
          </div>
        </div>

        {/* Teléfonos */}
        <div>
          <strong>Teléfono</strong>
          {Datos.telefonos && Datos.telefonos.length > 0 ? (
            Datos.telefonos.map((telefono, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                <InputText value={telefono} disabled />
              </div>
            ))
          ) : (
            <p>No hay teléfonos disponibles</p>
          )}
        </div>
      </div>
    </Dialog>
  );
}
