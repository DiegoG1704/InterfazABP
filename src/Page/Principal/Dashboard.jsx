import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Navbar from './Componentes/Navbar';
import './Styles/Dashboard.css';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import axios from 'axios';
import DialogAgregar from './Componentes/DialogAgregar';
import DialogTienda from './Componentes/DialogTienda';
import DialogFechas from './Componentes/DialogFechas';
import DialogObservaciones from './Componentes/DialogObservaciones';
import DialogPersonal from './Componentes/DialogPersonal';
import ExportExcel from './Componentes/ExportExcel';
import Cookies from "js-cookie";

export default function Dashboard() {
  const [select, setSelect] = useState([]);
  const [agregar, setAgregar] = useState(false);
  const [editPers, setEditPers] = useState(false);
  const [tienda, setTienda] = useState(false);
  const [observaciones, setObservaciones] = useState(false);
  const [fechas, setFechas] = useState(false);
  const [miembros, setMiembros] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [visibleSuspendConfirm, setVisibleSuspendConfirm] = useState(false);
  const [selectedSuspendMember, setSelectedSuspendMember] = useState(null);


  const fetchMiembrosCount = async () => {
    const token = Cookies.get("accessToken")
    console.log('tok',token);
    
    if (!token) {
      console.log("No se encontró un token, el usuario no está autenticado.");
      return;
  }
    try {
      const response = await axios.get(`http://localhost:3000/afiliadosCount`,  {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,  // Si el backend usa cookies de autenticación
    });
      setCantidad(response.data);
    } catch (error) {
      console.log('Error al obtener miembros:', error);
    }
  };

  const fetchMiembros = async () => {
    try {
        const response = await axios.get("http://localhost:3000/List", {
            withCredentials: true, // 🔥 Esto enviará la cookie automáticamente
        });

        console.log("Datos:", response.data);
        setMiembros(response.data);
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                console.log("Error 401: No autorizado, el token puede haber expirado.");
            } else if (error.response.status === 403) {
                console.log("Error 403: Acceso denegado, permisos insuficientes.");
            } else {
                console.log(`Error ${error.response.status}:`, error.response.data);
            }
        } else {
            console.log("Error de red o de servidor:", error.message);
        }
    }
};



  useEffect(() => {
    fetchMiembros(); // Solo se ejecutará si hay un token
    fetchMiembrosCount();
  }, []); // El segundo useEffect solo se ejecuta una vez
  
  const Actualizar = () => {
    fetchMiembros();
    fetchMiembrosCount();
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

    const token = Cookies.get("accessToken")
    

    try {
      await axios.patch(`http://localhost:3000/Suspender/${selectedSuspendMember.id}`,{},  // El cuerpo de la solicitud está vacío, ya que solo queremos hacer una acción de confirmación
        {
            headers: {
                Authorization: `Bearer ${token}`, // Asegúrate de pasar el token correctamente en los headers
            },
        });
        Actualizar(); // Refrescar la lista después de la actualización
    } catch (error) {
      console.error('Error al suspender:', error);
    } finally {
      setVisibleSuspendConfirm(false);
    }
  };
  

  const handleReiniciar = async () => {
    if (!selectedMember) return;
    const token = Cookies.get("accessToken")

    try {
      await axios.patch(`http://localhost:3000/Reiniciar/${selectedMember.id}`,{},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Actualizar(); // Refrescar la lista después de la actualización
    } catch (error) {
      console.error('Error al reiniciar:', error);
    } finally {
      setVisibleConfirm(false); // Cerrar el ConfirmDialog después de la acción
    }
  };

  const ButtonTienda = (rowData) => {
    const isSuspendido = rowData.estadoSocio === 'Suspendido';
    return (
      <Button
        onClick={() => { setTienda(true); setSelect(rowData); }}
        style={{ borderRadius: '50px', background: '#e3cb42', borderColor: '#e3cb42' }}
        icon="pi pi-shop"
        disabled={isSuspendido} // Deshabilitar si estado es "Suspendido"
      />
    );
  };

  const ButtonFechas = (rowData) => {
    const isSuspendido = rowData.estadoSocio === 'Suspendido';
    return (
      <Button
        onClick={() => { setFechas(true); setSelect(rowData); }}
        style={{ borderRadius: '50px', background: '#6ba4c7', borderColor: '#6ba4c7' }}
        icon="pi pi-calendar"
        disabled={isSuspendido} // Deshabilitar si estado es "Suspendido"
      />
    );
  };

  const ButtonObs = (rowData) => {
    const isSuspendido = rowData.estadoSocio === 'Suspendido';
    return (
      <Button
        onClick={() => { setObservaciones(true); setSelect(rowData); }}
        style={{ borderRadius: '50px', background: '#6bc7a7', borderColor: '#6bc7a7' }}
        icon="pi pi-eye"
        disabled={isSuspendido} // Deshabilitar si estado es "Suspendido"
      />
    );
  };
  


  const ButtonHerram = (rowData) => {
    const isNuevo = rowData.estadoSocio === 'Nuevo';
    const isSuspendido = rowData.estadoSocio === 'Suspendido';
    
    return (
      <>
        <Button
          onClick={() => { setEditPers(true); setSelect(rowData); }}
          style={{ borderRadius: '50px', background: '#eb9226', borderColor: '#eb9226' }}
          icon="pi pi-pen-to-square"
          disabled={isSuspendido} // Deshabilitar si estado es "Suspendido"
        />
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
      String(miembro.apellido).toLowerCase().includes(lowercasedSearchTerm)
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

  return (
    <div className="dashboard-container">
      <Navbar setSearchTerm={setSearchTerm} />
      <div className="dashboard-content">
        <h1>Bienvenido a la Interfaz de Usuario de ABP</h1>
        <div className='cantidad'>
          <span>Activos:{cantidad?.activos}</span>
          <span>Suspendidos:{cantidad?.suspendidos}</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent:'space-between', margin: '20px' }}>
      <ExportExcel data={miembros} /> {/* Agregar el componente ExportExcel */}
        <Button
          label='+Agregar'
          style={{ background: 'white', color: 'black', borderColor: 'white' }}
          onClick={() => setAgregar(true)}
        />
      </div>
      <div className="dashboard-table">
        <DataTable value={filteredMiembros} tableStyle={{ minWidth: '50rem' }}>
          <Column header="Code" body={(rowData, { rowIndex }) => rowIndex + 1}></Column>
          <Column field="fechaAfiliacion" header="Fecha de Afiliacion"></Column>
          <Column field="ruc" header="Ruc"></Column>
          <Column field="dni" header="DNI"></Column>
          <Column field="nombre" header="Nombre"></Column>
          <Column field="apellido" header="Apellido"></Column>
          <Column field="estadoSocio" header="Estado" body={statusBodyTemplate}></Column> {/* Renderizado dinámico de estado */}
          <Column body={ButtonFechas} header="Pagos"></Column>
          <Column body={ButtonTienda} header="Tienda"></Column>
          <Column body={ButtonObs} header="Observacion"></Column>
          <Column body={ButtonHerram} header="Herramientas"></Column>
        </DataTable>
      </div>
      <DialogAgregar Visible={agregar} Close={() => setAgregar(false)} Actualizar={Actualizar} />
      <DialogTienda Visible={tienda} Close={() => setTienda(false)} Datos={select} SetDatos={setSelect} Actualizar={fetchMiembros} />
      <DialogFechas Visible={fechas} Close={() => setFechas(false)} Datos={select} />
      <DialogObservaciones Visible={observaciones} Close={() => setObservaciones(false)} Datos={select} SetDatos={setSelect} Actualizar={fetchMiembros} />
      <DialogPersonal Visible={editPers} Close={() => setEditPers(false)} Datos={select} Actualizar={fetchMiembros} />
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
