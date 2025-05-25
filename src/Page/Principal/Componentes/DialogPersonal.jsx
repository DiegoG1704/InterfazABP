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
        estado: [], // Cambiado a array
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
        if (!axiosInstance) return;
        try {
            const response = await axiosInstance.get(`/distritos`);
            setDistritos(response.data);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        fetchDistritos();
    }, []);

    const Estados = [
        { name: 'Nuevo', id: 1 },
        { name: 'Renovo', id: 2 },
        { name: 'Suspendido', id: 3 },
    ];

    const generarPDF = () => {
        const doc = new jsPDF();

        const datosFiltrados = Datos.filter(item => {
            const cumpleEstado =
                afiliados.estado.length === 0 ||
                afiliados.estado.some(id =>
                    item.estadoSocio?.toLowerCase() === Estados.find(e => e.id === id)?.name.toLowerCase()
                );

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
        doc.setFontSize(12);
        doc.text(`Total: ${totalAfiliados}`, 180, 20, { align: 'right' });

        // Agrupar por distrito y contar
        const conteoPorDistrito = {};
        datosFiltrados.forEach(d => {
            const nombreDistrito = d.distrito || 'Sin distrito';
            if (!conteoPorDistrito[nombreDistrito]) {
                conteoPorDistrito[nombreDistrito] = 0;
            }
            conteoPorDistrito[nombreDistrito]++;
        });

        const resumenDistrito = Object.entries(conteoPorDistrito)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([distrito, cantidad]) => [distrito, cantidad]);

        // Tabla de resumen
        autoTable(doc, {
            head: [['Distrito', 'Cantidad de Afiliados']],
            body: resumenDistrito,
            startY: 30
        });

        // Tabla de detalle
        const detalleY = doc.lastAutoTable.finalY + 10;
        autoTable(doc, {
            head: [['DNI', 'Nombres', 'Apellidos']],
            body: datosFiltrados.map(d => [d.dni, d.nombre, d.apellido]),
            startY: detalleY
        });

        doc.save('reporte.pdf');

        // Limpiar filtros
        setAfiliados({
            estado: [],
            departamento: [],
            distrito: []
        });
    };

    // Cambiar MultiSelect
    const handleMultiSelectChange = (e, field) => {
        const selectedIds = e.value.map(item => item.id);
        setAfiliados({ ...afiliados, [field]: selectedIds });
    };

    return (
        <div>
            <Dialog visible={Visible} onHide={Close} header='Exportar Afiliados'>
                <div className='flex flex-column'>
                    <strong>Exportar Lista de Afiliados</strong>
                    <ExportExcel data={Datos} />
                    <Divider align="center">
                        <strong>Filtros PDF</strong>
                    </Divider>

                    <strong>Estados</strong>
                    <MultiSelect
                        value={Estados.filter(e => afiliados.estado.includes(e.id))}
                        onChange={(e) => handleMultiSelectChange(e, 'estado')}
                        options={Estados}
                        optionLabel="name"
                        display="chip"
                        placeholder="Seleccionar Estados"
                        maxSelectedLabels={3}
                        className="w-full md:w-20rem"
                        filter
                    />

                    <strong>Departamentos</strong>
                    <MultiSelect
                        value={Departamentos.filter(d => afiliados.departamento.includes(d.id))}
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
                        value={distritos.filter(d => afiliados.distrito.includes(d.id))}
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
                    style={{ background: '#c77a6b', color: 'black', borderColor: '#c77a6b', width: '100%', margin: '5px' }}
                    onClick={generarPDF}
                />
            </Dialog>
        </div>
    );
}
