import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useState, useEffect } from 'react';
import axiosToken, { axiosTokenInstance } from '../Herramientas/AxiosToken';
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

const generarPDF = async () => {
    const axiosInstance = axiosToken();

    const estadosSeleccionados = Estados
        .filter(e => afiliados.estado.includes(e.id))
        .map(e => e.id.toString());
    const distritosSeleccionados = afiliados.distrito;
    const departamentosSeleccionados = Departamentos
        .filter(d => afiliados.departamento.includes(d.id))
        .map(d => d.name);

    const queryParams = new URLSearchParams();
    if (estadosSeleccionados.length > 0) queryParams.append('estados', estadosSeleccionados.join(','));
    if (distritosSeleccionados.length > 0) queryParams.append('distritos', distritosSeleccionados.join(','));
    if (departamentosSeleccionados.length > 0) queryParams.append('departamentos', departamentosSeleccionados.join(','));

    try {
        const response = await axiosTokenInstance.get(`informe?${queryParams.toString()}`);
        const datosFiltrados = response.data;
        const totalAfiliados = datosFiltrados.length;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Título centrado
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('REPORTE DE AFILIADOS', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const fecha = new Date().toLocaleDateString();
        doc.text(`Fecha: ${fecha}`, 14, 30);
        doc.text(`Total de afiliados: ${totalAfiliados}`, pageWidth - 14, 30, { align: 'right' });

        // Agrupación por distrito
        const conteoPorDistrito = {};
        datosFiltrados.forEach(d => {
            const nombreDistrito = d.distrito || 'Sin distrito';
            conteoPorDistrito[nombreDistrito] = (conteoPorDistrito[nombreDistrito] || 0) + 1;
        });

        const resumenDistrito = Object.entries(conteoPorDistrito)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([distrito, cantidad]) => [distrito, cantidad]);

        // Tabla con estilo
        autoTable(doc, {
            startY: 40,
            head: [['Distrito', 'Cantidad de Afiliados']],
            body: resumenDistrito,
            styles: {
                font: 'helvetica',
                fontSize: 10,
                cellPadding: 3,
                valign: 'middle',
            },
            headStyles: {
                fillColor: [199, 122, 107],
                textColor: 255,
                fontSize: 11,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            margin: { top: 40, bottom: 20 },
            didDrawPage: function (data) {
                // Footer con número de página
                const pageCount = doc.internal.getNumberOfPages();
                const pageSize = doc.internal.pageSize;
                const pageHeight = pageSize.height;
                doc.setFontSize(10);
                doc.text(`Página ${data.pageNumber} de ${pageCount}`, pageWidth / 2, pageHeight - 10, {
                    align: 'center',
                });
            }
        });

        doc.save(`ReporteAfiliados_${fecha.replace(/\//g, '-')}.pdf`);
    } catch (error) {
        console.error('Error al generar el PDF con la API:', error);
    }
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
