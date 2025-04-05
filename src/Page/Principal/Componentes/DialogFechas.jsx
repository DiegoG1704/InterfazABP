import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import axiosToken from '../Herramientas/AxiosToken';

export default function DialogFechas({ Visible, Close, Datos,Actualizar }) {
  const [fecha, setFecha] = useState({ pagos: [], ultimoAño: "", isNextYearDisabled: false }); // Agregar isNextYearDisabled al estado
  const toast = useRef(null);

  const accept = async () => {
    const axiosInstance = axiosToken();

    if (!axiosInstance) {
        return;
    }
    try {
        // Enviar el token en los headers
        const response = await axiosInstance.post(
            `/PostPago/${Datos?.id}`, // URL del endpoint
            {}
        );

        console.log(response);
        fetchFecha(); // Recargar la información
        Actualizar();
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    } catch (error) {
        console.log('error', error);
        if (error.response && error.response.status === 401) {
            toast.current.show({ severity: 'error', summary: 'Unauthorized', detail: 'Token no proporcionado o inválido.', life: 3000 });
        }
    }
};


  const reject = () => {
    Close()
    // toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const confirm1 = () => {
    confirmDialog({
      message: '¿Se realizo el pago?',
      header: 'Confirmacion de pago',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'Aceptar',
      accept,
      reject
    });
  };

  // Fetch the dates when the dialog is visible and `Datos` is provided
  useEffect(() => {
    if (Visible && Datos?.id) {
      fetchFecha(); // Trigger data fetching
    }
  }, [Visible, Datos]);

  const fetchFecha = async () => {
    const axiosInstance = axiosToken();

    if (!axiosInstance) {
        return;
    }
    try {
      const response = await axiosInstance.get(`/getFechPago/${Datos?.id}`);
      if (response.status === 200) {
        const { pagos, ultimoAño } = response.data;
        
        // Verificar si tenemos una fecha para calcular el próximo año
        let nextYear = "";
        if (ultimoAño) {
          const lastYearDate = new Date(ultimoAño.split('-').reverse().join('-')); // Convertir la fecha en formato DD-MM-YYYY
          lastYearDate.setFullYear(lastYearDate.getFullYear() + 1); // Sumar un año
          nextYear = `${lastYearDate.getDate().toString().padStart(2, '0')}-${(lastYearDate.getMonth() + 1).toString().padStart(2, '0')}-${lastYearDate.getFullYear()}`;
        }

        // Calcular la fecha un mes antes del próximo pago
        const nextYearDate = new Date(nextYear.split('-').reverse().join('-')); // Convertir la fecha a objeto Date
        nextYearDate.setMonth(nextYearDate.getMonth() - 1); // Restar un mes

        // Verificar si la fecha actual es antes de la fecha calculada para habilitar el botón
        const currentDate = new Date();
        const isNextYearDisabled = currentDate < nextYearDate; // Si es antes del mes anterior al próximo pago, deshabilitar

        // Actualizar el estado con los pagos y la nueva fecha
        setFecha({ pagos, ultimoAño: nextYear || "No disponible", isNextYearDisabled });
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        // Mostrar un mensaje específico cuando no se encuentren pagos
        setFecha({ pagos: [], ultimoAño: "Agregar primer pago" });
      } else {
        // Mostrar un mensaje de error genérico
        setFecha({ pagos: [], ultimoAño: "Error al cargar pagos" });
      }
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Dialog visible={Visible} onHide={Close} header="Fechas de Pago" style={{ width: '21rem' }}>
        <div className="flex flex-column">
          <strong>Próximo Pago: </strong>
          <Button
            onClick={confirm1}
            style={{ background: 'white', color: '#267aad', borderColor: '#267aad' }}
            label={fecha.ultimoAño || "No disponible"}
            // disabled={fecha.isNextYearDisabled} // Deshabilitar el botón si la fecha es menor que un mes antes del próximo pago
          />
        </div>
        <div className="flex flex-column">
          <strong>Pagos Realizados:</strong>
          <div>
            {/* Verifica si 'fecha.pagos' es un array con elementos antes de mapear */}
            {Array.isArray(fecha.pagos) && fecha.pagos.length > 0 ? (
              fecha.pagos.map((item, index) => (
                <Button
                  key={index}
                  style={{ background: 'white', color: '#349c05', borderColor: '#349c05', margin: '2px' }}
                  label={item.fecha} // Display the formatted date (DD-MM-YYYY)
                />
              ))
            ) : (
              <p>No se han encontrado pagos para este usuario.</p> // Mensaje mejorado
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
