import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DialogDistrito from '../Componentes/DialogDistrito';
import axiosToken from '../Herramientas/AxiosToken';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import DialogGrupo from '../Componentes/DialogGrupo';
import DialogMetodo from '../Componentes/DialogMetodo';
import { InputTextarea } from 'primereact/inputtextarea';
import '../Styles/Editar.css'

export default function EditarUsuario() {
    const navigate = useNavigate();
    const [nuevodist,setNuevodist]=useState(false)
    const[grupo,setGrupo]=useState(false)
    const[metodo,setMetodo]=useState(false)
  const { state } = useLocation();
  const [Datos, SetDatos] = useState(state);

  if (!state) {
    return <div>No se recibieron datos del usuario.</div>;
  }

  const [editingField, setEditingField] = useState(null);
  const [numero, setNumero] = useState(''); // Para crear o editar teléfonos

  const [isEditable, setIsEditable] = useState({
      dni:false,
      ruc:false,
      nombre:false,
      apellido:false,
      nombreBodega: false,
      direccion: false,
      distritoId: false,
      correo: false,
      telefono: false,
      estadoGrupo: false,
      metodoAfiliacion:false,
      observaciones:false,
    });
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
  const toast = useRef(null);
  const saveChanges = async (field) => {
    const campoYValor = {
    campo: field,
    valor: Datos[field],
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
      SetDatos((prev) => ({
        ...prev,
        [field]: campoYValor.valor
      }));      
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

  const [distritos, setDistritos] = useState([]);
  const[grupos,setGrupos]=useState([])
  const fetchGrupos = async () => {
    const axiosInstance = axiosToken();

    if (!axiosInstance) {
        return;
    }
      try {
          const response = await axiosInstance.get(`/getGrupos`);
          setGrupos(response.data);
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
        fetchMetodos();
        fetchGrupos();
  }, [state.id]);
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
    <div className="editar-usuario-container">
      <Toast ref={toast} />
      <h1 style={{color:'black',justifyContent:'space-between'}}>Editar Afiliado: {Datos.codigo}</h1>
      <div className='Title-container'>
          <div className='title-button-plus'>
            <Button label='Agregar Distrito' icon="pi pi-map-marker" severity="info" className="p-button-rounded custom-btn" onClick={() => setNuevodist(true)} />
            <Button label='Agregar Grupo' icon="pi pi-users" severity="success" className="p-button-rounded custom-btn" onClick={() => setGrupo(true)} />
            <Button label='Agregar Metodo' icon="pi pi-cog" severity="warning" className="p-button-rounded custom-btn" onClick={() => setMetodo(true)} />
          </div>
          <Button label='Regresar' icon="pi pi-arrow-left" className="p-button-outlined p-button-secondary regresar-btn" onClick={() => navigate('/Dashboard')} />
      </div>
      <div className='editar-section-container'>
        <div className="editar-usuario-section">
          <h3 style={{color:'black'}}>Datos de Afiliado</h3>
          <div className="editar-input-group">
            <strong className="editar-label">DNI</strong>
            <div className="editar-input-row">
            <InputText
                name="nombreBodega"
                value={Datos.dni}
                disabled={!isEditable.dni}
                onChange={(e) => handleInputChange(e, 'dni')}
            />
            {editingField !== 'dni' ? (
                <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-sm"
                style={{ color: '#e3cb42' }}
                onClick={() => enableField('dni')}
                />
            ) : (
                <Button
                icon="pi pi-save"
                className="p-button-text p-button-sm"
                style={{ color: '#6ba4c7' }}
                onClick={() => saveChanges('dni')}
                />
            )}
          </div>
          </div>
          <div className="editar-input-group">
            <strong className="editar-label">Ruc</strong>
            <div className="editar-input-row">
            <InputText
                name="nombreBodega"
                value={Datos.ruc}
                disabled={!isEditable.ruc}
                onChange={(e) => handleInputChange(e, 'ruc')}
            />
            {editingField !== 'ruc' ? (
                <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-sm"
                style={{ color: '#e3cb42' }}
                onClick={() => enableField('ruc')}
                />
            ) : (
                <Button
                icon="pi pi-save"
                className="p-button-text p-button-sm"
                style={{ color: '#6ba4c7' }}
                onClick={() => saveChanges('ruc')}
                />
            )}
          </div>
          </div>
          <div className="editar-input-group">
            <strong className="editar-label">Nombre</strong>
            <div className="editar-input-row">
            <InputText
                name="nombreBodega"
                value={Datos.nombre}
                disabled={!isEditable.nombre}
                onChange={(e) => handleInputChange(e, 'nombre')}
            />
            {editingField !== 'nombre' ? (
                <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-sm"
                style={{ color: '#e3cb42' }}
                onClick={() => enableField('nombre')}
                />
            ) : (
                <Button
                icon="pi pi-save"
                className="p-button-text p-button-sm"
                style={{ color: '#6ba4c7' }}
                onClick={() => saveChanges('nombre')}
                />
            )}
          </div>
          </div>
          <div className="editar-input-group">
            <strong className="editar-label">Apellido</strong>
            <div className="editar-input-row">
            <InputText
                name="nombreBodega"
                value={Datos.apellido}
                disabled={!isEditable.apellido}
                onChange={(e) => handleInputChange(e, 'apellido')}
            />
            {editingField !== 'apellido' ? (
                <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-sm"
                style={{ color: '#e3cb42' }}
                onClick={() => enableField('apellido')}
                />
            ) : (
                <Button
                icon="pi pi-save"
                className="p-button-text p-button-sm"
                style={{ color: '#6ba4c7' }}
                onClick={() => saveChanges('apellido')}
                />
            )}
          </div>
          </div>
        </div>
        <div className="editar-usuario-section">
          <h3 style={{color:'black'}}>Datos de Tienda</h3>
          <div className="editar-input-group">
              {/* Nombre de Tienda */}
              <div className="editar-input-group">
                  <strong className="editar-label">Nombre de Tienda</strong>
                  <div className="editar-input-row">
                  <InputText
                      name="nombreBodega"
                      value={Datos.nombreBodega}
                      disabled={!isEditable.nombreBodega}
                      onChange={(e) => handleInputChange(e, 'nombreBodega')}
                  />
                  {editingField !== 'nombreBodega' ? (
                      <Button
                      icon="pi pi-pencil"
                      className="p-button-text p-button-sm"
                      style={{ color: '#e3cb42' }}
                      onClick={() => enableField('nombreBodega')}
                      />
                  ) : (
                      <Button
                      icon="pi pi-save"
                      className="p-button-text p-button-sm"
                      style={{ color: '#6ba4c7' }}
                      onClick={() => saveChanges('nombreBodega')}
                      />
                  )}
                  </div>
              </div>
      
              {/* Dirección */}
              <div className="editar-input-group">
                  <strong className="editar-label">Dirección</strong>
                  <div className="editar-input-row">
                  <InputText
                      name="direccion"
                      value={Datos.direccion}
                      disabled={!isEditable.direccion}
                      onChange={(e) => handleInputChange(e, 'direccion')}
                  />
                  {editingField !== 'direccion' ? (
                      <Button
                      icon="pi pi-pencil"
                      className="p-button-text p-button-sm"
                      style={{ color: '#e3cb42' }}
                      onClick={() => enableField('direccion')}
                      />
                  ) : (
                      <Button
                      icon="pi pi-save"
                      className="p-button-text p-button-sm"
                      style={{ color: '#6ba4c7' }}
                      onClick={() => saveChanges('direccion')}
                      />
                  )}
                  </div>
              </div>
      
              {/* Distrito */}
              <div className="editar-input-group">
                  <strong className="editar-label">Distrito</strong>
                  <div className="editar-input-row">
                  <Dropdown
                      options={distritos}
                      optionLabel="nombre"
                      optionValue="id"
                      name="distritoId"
                      onChange={(e) => handleInputChange(e, 'distritoId')}
                      placeholder="Seleccione distrito..."
                      value={Datos.distritoId}
                      filter
                      disabled={!isEditable.distritoId}
                  />
                  {/* <Button onClick={()=>setNuevodist(true)} className="p-button-text p-button-sm"><i className="pi pi-plus-circle" style={{ color: '#6ba4c7',fontSize:'1.3rem' }}></i></Button> */}
                  {editingField !== 'distritoId' ? (
                      <Button
                      icon="pi pi-pencil"
                      className="p-button-text p-button-sm"
                      style={{ color: '#e3cb42' }}
                      onClick={() => enableField('distritoId')}
                      />
                  ) : (
                      <Button
                      icon="pi pi-save"
                      className="p-button-text p-button-sm"
                      style={{ color: '#6ba4c7' }}
                      onClick={() => saveChanges('distritoId')}
                      />
                  )}
                  </div>
              </div>
      
              {/* Correo */}
              <div className="editar-input-group">
                  <strong className="editar-label">Correo</strong>
                  <div className="editar-input-row">
                  <InputText
                      name="correo"
                      value={Datos.correo}
                      disabled={!isEditable.correo}
                      onChange={(e) => handleInputChange(e, 'correo')}
                  />
                  {editingField !== 'correo' ? (
                      <Button
                      icon="pi pi-pencil"
                      className="p-button-text p-button-sm"
                      style={{ color: '#e3cb42' }}
                      onClick={() => enableField('correo')}
                      />
                  ) : (
                      <Button
                      icon="pi pi-save"
                      className="p-button-text p-button-sm"
                      style={{ color: '#6ba4c7' }}
                      onClick={() => saveChanges('correo')}
                      />
                  )}
                  </div>
              </div>
      
              {/* Teléfonos */}
              <div>
                  <strong className="editar-label">Teléfono</strong>
                  <div className="editar-input-row">
                  <InputText placeholder="Ingresar teléfono..." value={numero} onChange={(e) => setNumero(e.target.value)} />
                  <Button icon="pi pi-check-square" style={{ background:'transparent', color: '#182d54', borderColor: 'white' }} onClick={CreateTelefono} />
                  </div>
                  {Datos.telefonos && Datos.telefonos.length > 0 ? (
                  Datos.telefonos.map((telefono, index) => (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
                      <div className="editar-input-row">
                          <InputText
                          value={telefono.numero}
                          disabled={!isEditable.telefono}
                          style={{ borderColor: 'white', color: 'black', fontWeight: 'bold' }}
                          onChange={(e)=>setNumero(e.target.value)}
                          />
                          {editingField !== 'telefono' ? (
                          <Button
                              icon="pi pi-pencil"
                              className="p-button-text p-button-sm"
                              style={{ color: '#e3cb42' }}
                              disabled
                              onClick={() => enableField('telefono')}
                          />
                          ) : (
                          <Button
                              icon="pi pi-save"
                              className="p-button-text p-button-sm"
                              style={{ color: '#6ba4c7' }}
                              onClick={() => EditTelefono(telefono.id)}
                          />
                          )}
                          <Button
                          icon="pi pi-trash"
                          className="p-button-text p-button-sm"
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
        </div>
        <div className="editar-usuario-section">
          <h3 style={{color:'black'}}>Afiliación</h3>
          <div className="editar-input-group">
            <div className="editar-input-group">
              <strong className="editar-label">Grupo</strong>
              <div className="editar-input-row">
              <Dropdown
                name='estadoGrupo' 
                value={Datos.estadoGrupo}  // Solo asignamos el 'id', no el objeto completo
                onChange={(e) => handleInputChange(e, 'estadoGrupo')}
                options={grupos}
                optionLabel="nombre"  // Mostrar el 'nombre' del grupo
                optionValue="id"  // Enviar solo el 'id' de la opción seleccionada
                placeholder="Seleccione grupo..."
                disabled={!isEditable.estadoGrupo} 
                filter
              />
              {/* <Button onClick={()=>setGrupo(true)} className="p-button-text p-button-sm"><i className="pi pi-plus-circle" style={{ color: '#6ba4c7',fontSize:'1.5rem' }}></i></Button> */}

                {editingField !== 'estadoGrupo' ? (
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-text p-button-sm"
                    style={{ color: '#e3cb42' }}
                    onClick={() => enableField('estadoGrupo')}
                  />
                ) : (
                  <Button
                    icon="pi pi-save"
                    className="p-button-text p-button-sm"
                    style={{ color: '#6ba4c7' }}
                    onClick={() => saveChanges('estadoGrupo')}
                  />
                )}
              </div>
            </div>
            <div className="editar-input-group">
              <strong className="editar-label">Metodo de Afiliacion</strong>
              <div className="editar-input-row">
              <Dropdown
                  name='metodoAfiliacion'
                  optionLabel="nombre"
                  optionValue="id"
                  value={Datos.metodoAfiliacion}  // Aquí buscamos el objeto completo
                  onChange={(e) => handleInputChange(e, 'metodoAfiliacion')}
                  options={Metodos}
                  placeholder="Seleccione metodo..."
                  disabled={!isEditable.metodoAfiliacion} 
                  filter
              />
              {/* <Button onClick={()=>setMetodo(true)} className="p-button-text p-button-sm"><i className="pi pi-plus-circle" style={{ color: '#6ba4c7',fontSize:'1.5rem' }}></i></Button> */}
              {editingField !== 'metodoAfiliacion' ? (
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-text p-button-sm"
                    style={{ color: '#e3cb42' }}
                    onClick={() => enableField('metodoAfiliacion')}
                  />
                ) : (
                  <Button
                    icon="pi pi-save"
                    className="p-button-text p-button-sm"
                    style={{ color: '#6ba4c7' }}
                    onClick={() => saveChanges('metodoAfiliacion')}
                  />
                )}
            </div>
            </div>
            <div className="editar-input-group">
            <strong className="editar-label">Observaciones</strong>
            <div className="editar-input-row">
              <InputTextarea
              name='observaciones'
              value={Datos.observaciones}
              disabled={!isEditable.observaciones} 
              onChange={(e) => handleInputChange(e, 'observaciones')}
              style={{height:'10rem'}}
              />
              {editingField !== 'observaciones' ? (
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-text p-button-sm"
                    style={{ color: '#e3cb42' }}
                    onClick={() => enableField('observaciones')}
                  />
                ) : (
                  <Button
                    icon="pi pi-save"
                    className="p-button-text p-button-sm"
                    style={{ color: '#6ba4c7' }}
                    onClick={() => saveChanges('observaciones')}
                  />
                )} 
            </div>
            </div>
          </div>  
        </div>
      </div>
      <DialogDistrito
        Visible={nuevodist}
        Close={()=>setNuevodist(false)}
        Actualizar={fetchDistritos}
      />
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
