import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import axiosToken from '../Herramientas/AxiosToken';
import { data } from 'react-router-dom';

export default function DialogTienda({ Visible, Close, Datos, SetDatos, Actualizar }) {
  const [isEditable, setIsEditable] = useState({
    nombreBodega: false,
    direccion: false,
    distritoId: false,
    correo: false,
    telefono: false,
  });

  const [editingField, setEditingField] = useState(null);
  const [numero, setNumero] = useState(''); // Para crear o editar teléfonos

  const enableField = (field) => {
    setIsEditable((prev) => ({
      ...prev,
      [field]: true,
    }));
    setEditingField(field);
  };

  const enableFalse = (field) => {
    setIsEditable((prev) => ({
      ...prev,
      [field]: false,
    }));
    setEditingField(null);
  };

  const saveChanges = async (field) => {
    const campoYValor = {
      campo: field,
      valor: field === 'distritoId' ? Datos.distritoId : Datos[field],
    };
    const axiosInstance = axiosToken();

    if (!axiosInstance) {
      return;
    }

    try {
      const response = await axiosInstance.patch(`/editCampo/${Datos.id}`, campoYValor);
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
    const axiosInstance = axiosToken();

    if (!axiosInstance) {
      return;
    }
    try {
      const response = await axiosInstance.get('/distritos');
      setDistritos(response.data);
    } catch (error) {
      console.log('Error al obtener los distritos:', error);
    }
  };

  const CreateTelefono = async () => {
    const axiosInstance = axiosToken();
  
    if (!axiosInstance) {
      return;
    }
    try {
      const response = await axiosInstance.post(`/CreateTelefono/${Datos.id}`, { numero });
      console.log('Éxito');
      // Agregar el nuevo teléfono a la lista sin recargar el resto de los datos
      SetDatos((prev) => ({
        ...prev,
        telefonos: [...prev.telefonos, { numero }] // Suponiendo que el teléfono nuevo tiene un formato similar
      }));
      setNumero(''); // Limpiar el campo de número
    } catch (error) {
      console.log(error);
    }
  };
  

  const EditTelefono = async (telefonoId) => {
    const axiosInstance = axiosToken();

    if (!axiosInstance) {
      return;
    }
    try {
      const response = await axiosInstance.put(`/Puttelefono/${Datos.id}/${telefonoId}`, { numero });
      console.log('Éxito');
      setIsEditable((prev) => ({
        ...prev,
        [field]: false,
      }));
      setEditingField(null);
      setNumero('');
      Actualizar();
    } catch (error) {
      console.log(error);
    }
  };

  // Eliminar teléfono
  const deleteTelefono = async (telefonoId) => {
    const axiosInstance = axiosToken();
  
    if (!axiosInstance) {
      return;
    }
  
    try {
      const response = await axiosInstance.delete(`/Deletelefono/${Datos.id}/${telefonoId}`);
      console.log('Teléfono eliminado');
      // Filtrar el teléfono eliminado de la lista sin recargar el resto de los datos
      SetDatos((prev) => ({
        ...prev,
        telefonos: prev.telefonos.filter(telefono => telefono.id !== telefonoId)
      }));
    } catch (error) {
      console.log('Error al eliminar el teléfono:', error);
    }
  };
  

  useEffect(() => {
    fetchDistritos();
  }, [Visible, Datos.id]);

  const handleInputChange = (e, field) => {
    const { value } = e.target;

    if (field === 'distritoId') {
      SetDatos((prev) => ({
        ...prev,
        distritoId: value,
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
          <div className="flex">
            <InputText
              name="nombreBodega"
              value={Datos.nombreBodega}
              disabled={!isEditable.nombreBodega}
              onChange={(e) => handleInputChange(e, 'nombreBodega')}
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
          <div className="flex">
            <InputText
              name="direccion"
              value={Datos.direccion}
              disabled={!isEditable.direccion}
              onChange={(e) => handleInputChange(e, 'direccion')}
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
          <div className="flex">
            <Dropdown
              options={distritos}
              optionLabel="nombre"
              optionValue="id"
              name="distritoId"
              style={{ width: '15rem' }}
              onChange={(e) => handleInputChange(e, 'distritoId')}
              placeholder="Seleccione distrito..."
              value={Datos.distritoId}
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>Correo</strong>
          <div className="flex">
            <InputText
              name="correo"
              value={Datos.correo}
              disabled={!isEditable.correo}
              onChange={(e) => handleInputChange(e, 'correo')}
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
          <div>
            <InputText placeholder="Ingresar teléfono..." value={numero} onChange={(e) => setNumero(e.target.value)} />
            <Button icon="pi pi-check-square" style={{ background: 'white', color: '#182d54', borderColor: 'white' }} onClick={CreateTelefono} />
          </div>
          {Datos.telefonos && Datos.telefonos.length > 0 ? (
            Datos.telefonos.map((telefono, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
                <div className="flex">
                  <InputText
                    value={telefono.numero}
                    disabled={!isEditable.telefono}
                    style={{ borderColor: 'white', color: 'black', fontWeight: 'bold', width: '12rem' }}
                    onChange={(e)=>setNumero(e.target.value)}
                  />
                  {editingField !== 'telefono' ? (
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-text"
                      style={{ color: '#e3cb42' }}
                      onClick={() => enableField('telefono')}
                    />
                  ) : (
                    <Button
                      icon="pi pi-save"
                      className="p-button-text"
                      style={{ color: '#6ba4c7' }}
                      onClick={() => EditTelefono(telefono.id)}
                    />
                  )}
                  <Button
                    icon="pi pi-trash"
                    className="p-button-text"
                    style={{ color: 'red' }}
                    onClick={() => deleteTelefono(telefono.id)} // Asegúrate de tener el `id` del teléfono
                  />
                </div>
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
