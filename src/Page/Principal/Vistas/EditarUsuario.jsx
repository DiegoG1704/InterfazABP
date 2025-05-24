

import { Button } from "primereact/button"
import { useEffect, useRef, useState } from "react"
import {  useNavigate, useParams } from "react-router-dom"
import DialogDistrito from "../Componentes/DialogDistrito"
import axiosToken from "../Herramientas/AxiosToken"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Toast } from "primereact/toast"
import DialogGrupo from "../Componentes/DialogGrupo"
import DialogMetodo from "../Componentes/DialogMetodo"
import { InputTextarea } from "primereact/inputtextarea"
import styles from "../../../features/affiliate/AffiliateEdit.module.css"
import { useDispatch } from "react-redux"
import { setLoading } from "../../../store/iuSlice"

export default function EditarUsuario() {
  const navigate = useNavigate()
  const [nuevodist, setNuevodist] = useState(false)
  const [grupo, setGrupo] = useState(false)
  const [metodo, setMetodo] = useState(false)
  // const { state } = useLocation()
  const [Datos, SetDatos] = useState({})
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("personal")
  const [editingField, setEditingField] = useState(null)
  const [numero, setNumero] = useState("")
  const [isEditable, setIsEditable] = useState({
    dni: false,
    ruc: false,
    nombre: false,
    apellido: false,
    nombreBodega: false,
    direccion: false,
    distritoId: false,
    correo: false,
    telefono: false,
    estadoGrupo: false,
    metodoAfiliacion: false,
    observaciones: false,
  })
  const dispatch = useDispatch();

  const toast = useRef(null)
  const enableField = (field) => {
    setIsEditable((prev) => ({
      ...prev,
      [field]: true,
    }));
    setEditingField(field);
  };
  const saveChanges = async (field) => {
    const campoYValor = {
      campo: field,
      valor: Datos[field],
    }

    const axiosInstance = axiosToken()

    if (!axiosInstance) {
      return
    }

    try {
      const response = await axiosInstance.patch(`/editCampo/${Datos.id}`, campoYValor)
      toast.current.show({
        severity: "success",
        summary: "Actualizacion exitosa",
        detail: "Exito al actualizar campo",
        life: 3000,
      })
      setIsEditable((prev) => ({
        ...prev,
        [field]: false,
      }))
      setEditingField(null)
      SetDatos((prev) => ({
        ...prev,
        [field]: campoYValor.valor,
      }))
      await fetchAffiliate()
    } catch (error) {
      console.log("error", error)
      const errorMsg = error.response?.data?.error || "Ocurrió un error al registrar al usuario."
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorMsg,
        life: 5000,
      })
    }
  }

  const [distritos, setDistritos] = useState([])
  const [grupos, setGrupos] = useState([])
  const [Metodos, setMetodos] = useState([])

  const fetchGrupos = async () => {
    const axiosInstance = axiosToken()
    if (!axiosInstance) return
    try {
      const response = await axiosInstance.get(`/getGrupos`)
      setGrupos(response.data)
    } catch (error) {
      console.log("error", error)
    }
  }
  const fetchAffiliate = async () => {
    const axiosInstance = axiosToken()
    if (!axiosInstance) return
    try {
      const response = await axiosInstance.get(`/afiliado/${id}`)
      SetDatos(response.data)
    } catch (error) {
      console.log("error", error)
    }
  }

  const fetchDistritos = async () => {
    const axiosInstance = axiosToken()
    if (!axiosInstance) return
    try {
      const response = await axiosInstance.get("/distritos")
      setDistritos(response.data)
    } catch (error) {
      console.log("Error al obtener los distritos:", error)
    }
  }

  const fetchMetodos = async () => {
    const axiosInstance = axiosToken()
    if (!axiosInstance) return
    try {
      const response = await axiosInstance.get(`/getMetodo`)
      setMetodos(response.data)
    } catch (error) {
      console.log("error", error)
    }
  }

  const CreateTelefono = async () => {
    const axiosInstance = axiosToken()
    if (!axiosInstance) return
    try {
      const response = await axiosInstance.post(`/CreateTelefono/${Datos.id}`, { numero })
      console.log("Éxito")
      SetDatos((prev) => ({
        ...prev,
        telefonos: [...prev.telefonos, { numero }],
      }))
      setNumero("")
    } catch (error) {
      console.log(error)
    }
  }

  const EditTelefono = async (telefonoId) => {
    const axiosInstance = axiosToken()
    if (!axiosInstance) return
    
    try {
      const response = await axiosInstance.put(`/Editartelefono/${Datos.id}/${telefonoId}`, { numero })
      console.log("Éxito")
      setIsEditable((prev) => ({
        ...prev,
        telefono: false,
      }))
      setEditingField(null)
      setNumero("")
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTelefono = async (telefonoId) => {
    const axiosInstance = axiosToken()
    if (!axiosInstance) return
    try {
      const response = await axiosInstance.delete(`/Deletelefono/${Datos.id}/${telefonoId}`)
      console.log("Teléfono eliminado")
      SetDatos((prev) => ({
        ...prev,
        telefonos: prev.telefonos.filter((telefono) => telefono.id !== telefonoId),
      }))
    } catch (error) {
      console.log("Error al eliminar el teléfono:", error)
    }
  }
  const loadData = async () => {
    dispatch(setLoading(true)); // Mostrar loader

    try {
      await Promise.all([fetchDistritos(),
      fetchMetodos(),
      fetchGrupos(),
      fetchAffiliate()]);
    } catch (error) {
      console.error("Error cargando datos", error);
    } finally {
      dispatch(setLoading(false)); // Mostrar loader// Ocultar loader (lógica de 5s ya está en <Loader />)
    }
  };
  useEffect(() => {
    // fetchDistritos()
    // fetchMetodos()
    // fetchGrupos()
    // fetchAffiliate()
    loadData()
  }, [])

  const handleInputChange = (e, field) => {
    const { value } = e.target
    if (field === "distritoId") {
      SetDatos((prev) => ({
        ...prev,
        distritoId: value,
      }))
    } else {
      SetDatos((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const tabs = [
    { id: "personal", label: "Datos Personales", icon: "pi pi-user" },
    { id: "store", label: "Información de Tienda", icon: "pi pi-building" },
    { id: "affiliation", label: "Afiliación", icon: "pi pi-users" },
  ]

  // if (!Datos) {
  //   return <div>No se recibieron datos del usuario.</div>
  // }


  return (
    <div className={styles.container}>
      <Toast ref={toast} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Button icon="pi pi-arrow-left" className={styles.backBtn} onClick={() => navigate("/Dashboard")} />
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Editor de Afiliado</h1>
            {/* <div className={styles.affiliateId}>ID: {Datos.codigo}</div> */}
          </div>
        </div>
        <div className={styles.quickActions}>
          <Button
            label="Distrito"
            icon="pi pi-map-marker"
            className={`${styles.quickBtn} ${styles.btnDistrict}`}
            onClick={() => setNuevodist(true)}
          />
          <Button
            label="Grupo"
            icon="pi pi-users"
            className={`${styles.quickBtn} ${styles.btnGroup}`}
            onClick={() => setGrupo(true)}
          />
          <Button
            label="Método"
            icon="pi pi-cog"
            className={`${styles.quickBtn} ${styles.btnMethod}`}
            onClick={() => setMetodo(true)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar with Profile */}
        <div className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.avatar}>
              <i className="pi pi-user" style={{ fontSize: "32px" }}></i>
            </div>
            <h3 className={styles.profileName}>
              {Datos.nombre} {Datos.apellido}
            </h3>
            <p className={styles.profileId}>DNI: {Datos.dni}</p>
            <div className={styles.profileStats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Estado</span>
                <span className={`${styles.statValue} ${styles.active}`}>Activo</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Código</span>
                <span className={styles.statValue}>{Datos.codigo}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className={styles.tabNav}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ""}`}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          <div className={styles.tabContent}>
            {/* Personal Data Tab */}
            {activeTab === "personal" && (
              <div className={styles.tabPanel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>
                    <i className="pi pi-user"></i>
                    Información Personal
                  </h2>
                  <p className={styles.panelDescription}>Gestiona los datos personales del afiliado</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        <i className="pi pi-id-card"></i>
                        Documento de Identidad (DNI)
                      </label>
                      <div className={styles.inputWrapper}>
                        <InputText
                          value={Datos.dni}
                          disabled={!isEditable.dni}
                          onChange={(e) => handleInputChange(e, "dni")}
                          className={styles.input}
                        />
                        {editingField !== "dni" ? (
                          <Button
                            icon="pi pi-pencil"
                            className={styles.editBtn}
                            onClick={() => enableField('dni')}
                          />
                        ) : (
                          <Button icon="pi pi-save" className={styles.editBtn} onClick={() => saveChanges("dni")} />
                        )}
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        <i className="pi pi-building"></i>
                        RUC
                      </label>
                      <div className={styles.inputWrapper}>
                        <InputText
                          value={Datos.ruc}
                          disabled={!isEditable.ruc}
                          onChange={(e) => handleInputChange(e, "ruc")}
                          className={styles.input}
                        />
                        {editingField !== "ruc" ? (
                          <Button
                            icon="pi pi-pencil"
                            className={styles.editBtn}
                            onClick={() => enableField('ruc')}
                          />
                        ) : (
                          <Button icon="pi pi-save" className={styles.editBtn} onClick={() => saveChanges("ruc")} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        <i className="pi pi-user"></i>
                        Nombre
                      </label>
                      <div className={styles.inputWrapper}>
                        <InputText
                          value={Datos.nombre}
                          disabled={!isEditable.nombre}
                          onChange={(e) => handleInputChange(e, "nombre")}
                          className={styles.input}
                        />
                        {editingField !== "nombre" ? (
                          <Button
                            icon="pi pi-pencil"
                            className={styles.editBtn}
                            onClick={() => enableField('nombre')}
                          />
                        ) : (
                          <Button icon="pi pi-save" className={styles.editBtn} onClick={() => saveChanges("nombre")} />
                        )}
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        <i className="pi pi-user"></i>
                        Apellido
                      </label>
                      <div className={styles.inputWrapper}>
                        <InputText
                          value={Datos.apellido}
                          disabled={!isEditable.apellido}
                          onChange={(e) => handleInputChange(e, "apellido")}
                          className={styles.input}
                        />
                        {editingField !== "apellido" ? (
                          <Button
                            icon="pi pi-pencil"
                            className={styles.editBtn}
                            onClick={() => enableField('apellido')}
                          />
                        ) : (
                          <Button
                            icon="pi pi-save"
                            className={styles.editBtn}
                            onClick={() => saveChanges("apellido")}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Store Data Tab */}
            {activeTab === "store" && (
              <div className={styles.tabPanel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>
                    <i className="pi pi-building"></i>
                    Información de Tienda
                  </h2>
                  <p className={styles.panelDescription}>Configura los datos del establecimiento comercial</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <i className="pi pi-building"></i>
                      Nombre de la Tienda
                    </label>
                    <div className={styles.inputWrapper}>
                      <InputText
                        value={Datos.nombreBodega}
                        disabled={!isEditable.nombreBodega}
                        onChange={(e) => handleInputChange(e, "nombreBodega")}
                        className={styles.input}
                      />
                      {editingField !== "nombreBodega" ? (
                        <Button
                          icon="pi pi-pencil"
                          className={styles.editBtn}
                          onClick={() => enableField('nombreBodega')}
                        />
                      ) : (
                        <Button
                          icon="pi pi-save"
                          className={styles.editBtn}
                          onClick={() => saveChanges("nombreBodega")}
                        />
                      )}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        <i className="pi pi-map-marker"></i>
                        Dirección
                      </label>
                      <div className={styles.inputWrapper}>
                        <InputText
                          value={Datos.direccion}
                          disabled={!isEditable.direccion}
                          onChange={(e) => handleInputChange(e, "direccion")}
                          className={styles.input}
                        />
                        {editingField !== "direccion" ? (
                          <Button
                            icon="pi pi-pencil"
                            className={styles.editBtn}
                            onClick={() => enableField('direccion')}
                          />
                        ) : (
                          <Button
                            icon="pi pi-save"
                            className={styles.editBtn}
                            onClick={() => saveChanges("direccion")}
                          />
                        )}
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        <i className="pi pi-map-marker"></i>
                        Distrito
                      </label>
                      <div className={styles.inputWrapper}>
                        <Dropdown
                          options={distritos}
                          optionLabel="nombre"
                          optionValue="id"
                          onChange={(e) => handleInputChange(e, "distritoId")}
                          placeholder="Seleccione distrito..."
                          value={Datos.distritoId}
                          filter
                          disabled={!isEditable.distritoId}
                          className={styles.select}
                        />
                        {editingField !== "distritoId" ? (
                          <Button
                            icon="pi pi-pencil"
                            className={styles.editBtn}
                            onClick={() => enableField('distritoId')}
                          />
                        ) : (
                          <Button
                            icon="pi pi-save"
                            className={styles.editBtn}
                            onClick={() => saveChanges("distritoId")}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <i className="pi pi-envelope"></i>
                      Correo Electrónico
                    </label>
                    <div className={styles.inputWrapper}>
                      <InputText
                        value={Datos.correo}
                        disabled={!isEditable.correo}
                        onChange={(e) => handleInputChange(e, "correo")}
                        className={styles.input}
                      />
                      {editingField !== "correo" ? (
                        <Button
                          icon="pi pi-pencil"
                          className={styles.editBtn}
                          onClick={() => enableField('correo')}
                        />
                      ) : (
                        <Button icon="pi pi-save" className={styles.editBtn} onClick={() => saveChanges("correo")} />
                      )}
                    </div>
                  </div>

                  <div className={styles.phoneSection}>
                    <div className={styles.phoneHeader}>
                      <label className={styles.label}>
                        <i className="pi pi-phone"></i>
                        Números de Teléfono
                      </label>
                      <Button
                        icon="pi pi-plus"
                        label="Agregar Teléfono"
                        className={styles.addBtn}
                        onClick={CreateTelefono}
                        disabled={!numero}
                      />
                    </div>
                    <div className={styles.phoneList}>
                      <div className={styles.phoneItem}>
                        <InputText
                          placeholder="Número de teléfono"
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                          className={styles.input}
                          type="number"
                        />
                      </div>
                      {Datos.telefonos && Datos.telefonos.length > 0 ? (
                        Datos.telefonos.map((telefono, index) => (
                          <div key={index} className={styles.phoneItem}>
                            <InputText
                              value={telefono.numero}
                              disabled={!isEditable.telefono}
                              onChange={(e) => setNumero(e.target.value)}
                              className={styles.input}
                            />
                            {editingField !== "telefono" ? (
                              <Button
                                icon="pi pi-pencil"
                                className={styles.editBtn}
                                onClick={() => enableField('telefono')}
                              />
                            ) : (
                              <Button
                                icon="pi pi-save"
                                className={styles.editBtn}
                                onClick={() => EditTelefono(telefono.id)}
                              />
                            )}
                            <Button
                              icon="pi pi-trash"
                              className={styles.deleteBtn}
                              onClick={() => deleteTelefono(telefono.id)}
                            />
                          </div>
                        ))
                      ) : (
                        <p className={styles.noData}>No hay teléfonos disponibles</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Affiliation Tab */}
            {activeTab === "affiliation" && (
              <div className={styles.tabPanel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>
                    <i className="pi pi-users"></i>
                    Configuración de Afiliación
                  </h2>
                  <p className={styles.panelDescription}>Administra la afiliación y configuraciones del grupo</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        <i className="pi pi-users"></i>
                        Grupo de Afiliación
                      </label>
                      <div className={styles.inputWrapper}>
                        <Dropdown
                          value={Datos.estadoGrupo}
                          onChange={(e) => handleInputChange(e, "estadoGrupo")}
                          options={grupos}
                          optionLabel="nombre"
                          optionValue="id"
                          placeholder="Seleccione grupo..."
                          disabled={!isEditable.estadoGrupo}
                          filter
                          className={styles.select}
                        />
                        {editingField !== "estadoGrupo" ? (
                          <Button
                            icon="pi pi-pencil"
                            className={styles.editBtn}
                            onClick={() => enableField('estadoGrupo')}
                          />
                        ) : (
                          <Button
                            icon="pi pi-save"
                            className={styles.editBtn}
                            onClick={() => saveChanges("estadoGrupo")}
                          />
                        )}
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        <i className="pi pi-cog"></i>
                        Método de Afiliación
                      </label>
                      <div className={styles.inputWrapper}>
                        <Dropdown
                          optionLabel="nombre"
                          optionValue="id"
                          value={Datos.metodoAfiliacion}
                          onChange={(e) => handleInputChange(e, "metodoAfiliacion")}
                          options={Metodos}
                          placeholder="Seleccione método..."
                          disabled={!isEditable.metodoAfiliacion}
                          filter
                          className={styles.select}
                        />
                        {editingField !== "metodoAfiliacion" ? (
                          <Button
                            icon="pi pi-pencil"
                            className={styles.editBtn}
                            onClick={() => enableField('metodoAfiliacion')}
                          />
                        ) : (
                          <Button
                            icon="pi pi-save"
                            className={styles.editBtn}
                            onClick={() => saveChanges("metodoAfiliacion")}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <i className="pi pi-file-edit"></i>
                      Observaciones y Notas
                    </label>
                    <div className={styles.textareaWrapper}>
                      <InputTextarea
                        value={Datos.observaciones}
                        disabled={!isEditable.observaciones}
                        onChange={(e) => handleInputChange(e, "observaciones")}
                        className={styles.textarea}
                        rows={6}
                        placeholder="Agregar observaciones, notas importantes o comentarios adicionales..."
                      />
                      {editingField !== "observaciones" ? (
                        <Button
                          icon="pi pi-pencil"
                          className={styles.editBtn}
                          onClick={() => enableField('observaciones')}
                        />
                      ) : (
                        <Button
                          icon="pi pi-save"
                          className={styles.editBtn}
                          onClick={() => saveChanges("observaciones")}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <DialogDistrito Visible={nuevodist} Close={() => setNuevodist(false)} Actualizar={fetchDistritos} />
      <DialogGrupo Visible={grupo} Close={() => setGrupo(false)} Actualizar={fetchDistritos} />
      <DialogMetodo Visible={metodo} Close={() => setMetodo(false)} Actualizar={fetchMetodos} />
    </div>
  )
}
