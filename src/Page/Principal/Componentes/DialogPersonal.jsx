import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useState, useEffect } from 'react';
import axiosToken from '../Herramientas/AxiosToken';
import ExportExcel from './ExportExcel';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DialogPersonal({ Visible, Close, Datos }) {
    const [afiliados, setAfiliados] = useState({
        estado: null,
        departamento: [],
        distrito: []
    });    

    const Departamentos=[
        { name: "Lima", id: 1 },
        { name: "Arequipa", id: 2 },
        { name: "Amazonas", id: 3 },
        { name: "Áncash", id: 4 },
        { name: "Apurímac", id: 5 },
        { name: "Ayacucho", id: 6 },
        { name: "Cajamarca", id: 7 },
        { name: "Callao", id: 8 },
        { name: "Cusco", id: 9 },
        { name: "Huancavelica", id: 10 },
        { name: "Huánuco", id: 11 },
        { name: "Ica", id: 12 },
        { name: "Junín", id: 13 },
        { name: "La Libertad", id: 14 },
        { name: "Lambayeque", id: 15 },
        { name: "Loreto", id: 16 },
        { name: "Madre de Dios", id: 17 },
        { name: "Moquegua", id: 18 },
        { name: "Pasco", id: 19 },
        { name: "Piura", id: 20 },
        { name: "Puno", id: 21 },
        { name: "San Martín", id: 22 },
        { name: "Tacna", id: 23 },
        { name: "Tumbes", id: 24 },
        { name: "Ucayali", id: 25 },
        { name: "Suspendido", id: 26 }
      ]

      const [distritos, setDistritos] = useState([]);
      const fetchDistritos = async () => {
        const axiosInstance = axiosToken();

        if (!axiosInstance) {
            return;
        }
        try {
            const response = await axiosInstance.get(`/distritos`);
            setDistritos(response.data);
        } catch (error) {
            console.log('error', error);
        }
    }

    useEffect(() => {
        fetchDistritos();
    }, []);

    const Estados =[
        {name:'Nuevo',id:1},
        {name:'Renovo',id:2},
        {name:'Suspendido',id:3},
    ]

    const generarPDF = () => {
        const doc = new jsPDF();
    
        const datosFiltrados = Datos.filter(item => {
            const cumpleEstado =
                !afiliados.estado ||
                item.estadoSocio?.toLowerCase() === Estados.find(e => e.id === afiliados.estado)?.name.toLowerCase();
    
            const cumpleDistrito =
                afiliados.distrito.length === 0 || afiliados.distrito.includes(item.distritoId);
    
            const cumpleDepartamento =
                afiliados.departamento.length === 0 ||
                afiliados.departamento.includes(
                    Departamentos.find(dep => dep.name.toLowerCase() === item.departamento?.toLowerCase())?.id
                );
    
            return cumpleEstado && cumpleDistrito && cumpleDepartamento;
        });
    
        const totalAfiliados = datosFiltrados.length;
    
        doc.setFontSize(14);
        doc.text("Reporte de Afiliados", 14, 20);
    
        doc.setFontSize(18);
        doc.text(`Total: ${totalAfiliados}`, 180, 20, { align: 'right' });
    
        const rows = datosFiltrados.map(d => [d.dni, d.nombre, d.apellido]);
    
        autoTable(doc, {
            head: [['DNI', 'Nombres', 'Apellidos']],
            body: rows,
            startY: 30
        });
    
        doc.save('reporte_afiliados.pdf');
    
        // Limpiar filtros al final
        setAfiliados({
            estado: null,
            departamento: [],
            distrito: []
        });
    };
    

    // Para Dropdown (valor único)
    const handleDropdownChange = (e, field) => {
        setAfiliados({ ...afiliados, [field]: e.value ? e.value.id : null });
    };    

    // Para MultiSelect (múltiples valores)
    const handleMultiSelectChange = (e, field) => {
        // Aquí puedes guardar los IDs solamente si prefieres, o los objetos seleccionados
        const selectedIds = e.value.map(item => item.id);
        setAfiliados({ ...afiliados, [field]: selectedIds });
    };

    return (
        <div>
            <Dialog visible={Visible} onHide={Close} header='Exportar Afiliados'>
                <div className='flex flex-column'>
                    <strong>Exportar Lista de Afiliados</strong>
                    <ExportExcel data={Datos}/>
                    <Divider align="center">
                        <strong>Filtros PDF</strong>
                    </Divider>
                    <strong>Estados</strong>
                    <Dropdown 
                        filter
                        value={Estados.find(e => e.id === afiliados.estado) || null} 
                        options={Estados} 
                        onChange={(e) => handleDropdownChange(e, 'estado')} 
                        optionLabel="name"
                        showClear
                        placeholder="Selecciona un estado"
                        style={{padding:'0px'}}
                    />
                    <strong>Departamentos</strong>
                    <MultiSelect 
                        value={Departamentos.filter(d => afiliados.departamento?.includes(d.id))} 
                        onChange={(e) => handleMultiSelectChange(e, 'departamento')} 
                        options={Departamentos} 
                        optionLabel="name" 
                        display="chip" 
                        placeholder="Seleccionar Departamentos" 
                        maxSelectedLabels={3} 
                        className="w-full md:w-20rem" 
                        filter
                    />
                    <strong>Distritos</strong>
                    <MultiSelect 
                        value={distritos.filter(d => afiliados.distrito?.includes(d.id))} 
                        onChange={(e) => handleMultiSelectChange(e, 'distrito')} 
                        options={distritos} 
                        optionLabel="nombre" 
                        display="chip" 
                        placeholder="Seleccionar Distritos" 
                        maxSelectedLabels={3} 
                        className="w-full md:w-20rem" 
                        filter
                    />
                </div>
                <Button 
                label='Exportar PDF'
                icon="pi pi-file-pdf"
                style={{ background: '#c77a6b', color: 'black', borderColor: '#c77a6b',width:'100%',margin:'5px' }}
                onClick={generarPDF}/> 
            </Dialog>
        </div>
    );
}
