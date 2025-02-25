// src/Componentes/ExportExcel.js
import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from 'primereact/button';

const ExportExcel = ({ data }) => {

  const exportToExcel = () => {
    // Formatear los datos de los miembros
    const formattedData = data.map((miembro) => ({
      "Fecha de Afiliacion": miembro.fechaAfiliacion,
      "Ruc": miembro.ruc,
      "DNI": miembro.dni,
      "Nombre": miembro.nombre,
      "Apellido": miembro.apellido,
      "Estado": miembro.estadoSocio,
      "Observaciones": miembro.observaciones,
      "Correo": miembro.correo,
      "Telefonos": miembro.telefonos.join(", "),  // Unir los números de teléfono
      "Distrito": miembro.distrito,
      "Nombre Bodega": miembro.nombreBodega,
      "Referencia": miembro.referencia,
    }));

    // Crear una hoja de trabajo a partir de los datos
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Crear un libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Miembros');

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(wb, 'miembros.xlsx');
  };

  return (
    <Button 
      label="Exportar Excel"
      icon="pi pi-file-excel"
      style={{ background: '#6bc7a7', color: 'black', borderColor: '#6bc7a7' }}
      onClick={exportToExcel}
    />
  );
};

export default ExportExcel;
