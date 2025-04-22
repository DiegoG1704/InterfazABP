import React, { useState, useEffect, useRef } from 'react';
import './Styles/Dashboard.css';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import DialogAgregar from './Componentes/DialogAgregar';
import DialogFechas from './Componentes/DialogFechas';
import DialogPersonal from './Componentes/DialogPersonal';
import { InputText } from 'primereact/inputtext';
import axiosToken from './Herramientas/AxiosToken';
import CustomDataTable from './Herramientas/CustomDataTable';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import FomularioPers from './Componentes/FomularioPers';

export default function Dashboard() {
  const toast = useRef(null);
  const [select, setSelect] = useState([]);
  const [agregar, setAgregar] = useState(false);
  const [editPers, setEditPers] = useState(false);
  const [fechas, setFechas] = useState(false);
  const [miembros, setMiembros] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [visibleSuspendConfirm, setVisibleSuspendConfirm] = useState(false);
  const [selectedSuspendMember, setSelectedSuspendMember] = useState(null);
  const navigate = useNavigate();


  const fetchMiembrosCount = async () => {
    const token = localStorage.getItem("authToken");
    const axiosInstance = axiosToken();

    if (!axiosInstance) {
        return;
    }
    try {
      const response = await axiosInstance.get(`/afiliadosCount`);
      setCantidad(response.data);
    } catch (error) {
      console.log('Error al obtener miembros:', error);
    }
  };
  
  useEffect(() => {
    fetchMiembros();
    fetchMiembrosCount();
  }, []);

  const fetchMiembros = async () => {
    const axiosInstance = axiosToken();

    if (!axiosInstance) {
        return;
    }
    try {
      const response = await axiosInstance.get(`/List`,);
      setMiembros(response.data);
    } catch (error) {
      console.log('Error al obtener miembros:', error);
    }
  };

  const Actualizar = () => {
    fetchMiembros();  // Refresh members
    fetchMiembrosCount();  // Refresh count
  };  

  const openConfirmDialog = (rowData) => {
    setSelectedMember(rowData); // Guarda el miembro seleccionado
    setVisibleConfirm(true); // Muestra el diálogo
  };

  const openSuspendConfirmDialog = (rowData) => {
    setSelectedSuspendMember(rowData);
    setVisibleSuspendConfirm(true);
  };

  const handleSuspender = async () => {
    if (!selectedSuspendMember) return;

    const axiosInstance = axiosToken();

        if (!axiosInstance) {
            return;
        }
    try {
      await axiosInstance.patch(`/Suspender/${selectedSuspendMember.id}`,{});
      toast.current.show({
        severity: 'success',
        summary: 'Actualizacion exitosa',
        detail: 'Exito al suspender afiliado',
        life: 3000
    });
        Actualizar(); // Refrescar la lista después de la actualización
    } catch (error) {
      console.error('Error al suspender:', error);
      const errorMsg = error.response?.data?.error || 'Ocurrió un error al suspender al usuario.';
      toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: errorMsg,
          life: 5000
      });
    } finally {
      setVisibleSuspendConfirm(false);
    }
  };
  

  const handleReiniciar = async () => {
    if (!selectedMember) return;
    const axiosInstance = axiosToken();

    if (!axiosInstance) {
        return;
    }
    try {
      await axiosInstance.patch(`/Reiniciar/${selectedMember.id}`,{});
      Actualizar(); // Refrescar la lista después de la actualización
      toast.current.show({
        severity: 'success',
        summary: 'Actualizacion exitosa',
        detail: 'Exito al reiniciar estado afiliado',
        life: 3000
    });
    } catch (error) {
      console.error('Error al reiniciar:', error);
      const errorMsg = error.response?.data?.error || 'Ocurrió un error al reiniciar al usuario.';
      toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: errorMsg,
          life: 5000
      });
    } finally {
      setVisibleConfirm(false); // Cerrar el ConfirmDialog después de la acción
    }
  };

  const ButtonFechas = (rowData) => {
    const isSuspendido = rowData.estadoSocio === 'Suspendido';
    return (
      <Button
        onClick={() => { setFechas(true); setSelect(rowData); }}
        style={{ borderRadius: '50px', background: '#6ba4c7', borderColor: '#6ba4c7' }}
        icon="pi pi-calendar"
        //disabled={isSuspendido} // Deshabilitar si estado es "Suspendido"
      />
    );
  };

  const ButtonDatos = (rowData) => {
    return (
      <Button
        style={{ borderRadius: '50px', background: '#182d54', borderColor: '#182d54' }}
        icon="pi pi-arrow-right"
        onClick={() => navigate(`/Dashboard/editar/${rowData.id}`, { state: rowData })}
      />
    );
  };  

  const ButtonHerram = (rowData) => {
    const isNuevo = rowData.estadoSocio === 'Nuevo';
    const isSuspendido = rowData.estadoSocio === 'Suspendido';
    
    return (
      <>
        <Button
          onClick={() => openConfirmDialog(rowData)}
          style={{ borderRadius: '50px', background: '#04a3bf', borderColor: '#04a3bf' }}
          icon="pi pi-replay"
          disabled={isNuevo} // Deshabilitar si estado es "Nuevo"
        />
        <Button
          onClick={() => openSuspendConfirmDialog(rowData)}
          style={{ borderRadius: '50px', background: '#bd3831', borderColor: '#bd3831' }}
          icon="pi pi-times"
          disabled={isSuspendido} // Deshabilitar si estado es "Suspendido"
        />
      </>
    );
  };

  // Filtrar miembros según el texto de búsqueda
  const filteredMiembros = miembros.filter((miembro) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      String(miembro.dni).toLowerCase().includes(lowercasedSearchTerm) ||
      String(miembro.ruc).toLowerCase().includes(lowercasedSearchTerm) ||
      String(miembro.nombre).toLowerCase().includes(lowercasedSearchTerm) ||
      String(miembro.apellido).toLowerCase().includes(lowercasedSearchTerm)||
      String(miembro.codigo).toLowerCase().includes(lowercasedSearchTerm)
    );
  });

  // Mostrar estado con el color correspondiente
  const statusBodyTemplate = (rowData) => {
    const estadoSocio = rowData.estadoSocio;  // Obtener el estadoSocio del rowData
    switch (estadoSocio) {
      case 'Nuevo':
        return (
          <span style={{ color: 'white', backgroundColor: '#5ac48c', padding: '5px 10px', borderRadius: '5px' }}>
            {estadoSocio}
          </span>
        );
      case 'Renovo':
        return (
          <span style={{ color: 'white', backgroundColor: '#60a3cc', padding: '5px 10px', borderRadius: '5px' }}>
            {estadoSocio}
          </span>
        );
      case 'Suspendido':
        return (
          <span style={{ color: 'white', backgroundColor: '#e06e6e', padding: '5px 10px', borderRadius: '5px' }}>
            {estadoSocio}
          </span>
        );
      default:
        return (
          <span style={{ color: 'white', backgroundColor: 'gray', padding: '5px 10px', borderRadius: '5px' }}>
            {estadoSocio}
          </span>
        );
    }
  }; 
  
  const columns = [
    {
      header: 'Nº',
      body: (row, { rowIndex }) => rowIndex + 1,
    },
    { header: 'Codigo', field: 'codigo' },
    { header: 'DNI', field: 'dni' },
    { header: 'Nombres', field: 'nombre' },
    { header: 'Apellidos', field: 'apellido' },
    {
      header: 'Estado',
      body: statusBodyTemplate,
      className: 'button-header', // Añadir clase aquí
    },
    {
      header: 'Pagos',
      body: ButtonFechas,
      className: 'button-header', // Añadir clase aquí
    },
    {
      header: 'Herramientas',
      body: ButtonHerram,
      className: 'button-header', // Añadir clase aquí
    },
    { header: 'Datos', body:ButtonDatos },
  ];  

  return (
    <div className="dashboard-container">
      <Toast ref={toast} />
      <div className="dashboard-content">
        <h1>Bienvenido a la Interfaz de Usuario de ABP</h1>
        <div className='cantidad'>
          <span>Activos:{cantidad?.activos}</span>
          <span>Suspendidos:{cantidad?.suspendidos}</span>
        </div>
      </div>
      <div className='Buscador'>
      <InputText
          placeholder="Buscar miembro..." 
          className="search-input" 
          onChange={(e) => setSearchTerm(e.target.value)}  // Actualizar el término de búsqueda
        />
        <div className='Aplicaciones'>
          <Button onClick={()=>setEditPers(true)} icon='pi pi-filter' label='Exportar' style={{background:'#6b96c7',borderColor:'#6b96c7'}}/>
          <Button
            label='+Agregar'
            style={{ background: 'white', color: 'black', borderColor: 'white' }}
            onClick={() => setAgregar(true)}
          />
        </div>
      </div>
      <div className="dashboard-table">
        <CustomDataTable
          columns={columns}
          value={filteredMiembros}
          paginator={true}
          rows={5}  // Número de filas por página
          rowsPerPageOptions={[5, 10, 25, 50]}  // Opciones de filas por página
        />
      </div>
      <DialogPersonal Visible={editPers} Close={()=>setEditPers(false)} Datos={miembros}/>
      <DialogAgregar Visible={agregar} Close={() => setAgregar(false)} Actualizar={Actualizar} />
      <DialogFechas Visible={fechas} Close={() => setFechas(false)} Datos={select} Actualizar={fetchMiembros}/>
      <ConfirmDialog
        visible={visibleConfirm}
        onHide={() => setVisibleConfirm(false)}
        message="¿Estás seguro de que quieres reiniciar el estado de este usuario?"
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        accept={handleReiniciar}
        reject={() => setVisibleConfirm(false)}
      />
      <ConfirmDialog
        visible={visibleSuspendConfirm}
        onHide={() => setVisibleSuspendConfirm(false)}
        message="¿Estás seguro de que quieres suspender este usuario?"
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        accept={handleSuspender}
        reject={() => setVisibleSuspendConfirm(false)}
      />

    </div>
  );
}
