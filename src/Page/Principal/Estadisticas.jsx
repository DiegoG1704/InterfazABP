import React from 'react';
import { Card } from 'primereact/card';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Barras from './ComponEstadis/Barras';
import Rueda from './ComponEstadis/Rueda';

export default function Estadisticas() {
  return (
    <div className="m-3">
      <strong style={{ color: 'black', fontSize: '2rem', display: 'block', marginBottom: '20px' }}>
        Estadísticas
      </strong>
      
      <div className="grid p-fluid">
        {/* Tarjeta Total Afiliados */}
        <div className="col-12 sm:col-6 md:col-3">
          <Card 
            className="card-stats"
            title="Total Afiliados"
            style={{ borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex align-items-center justify-content-between" style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>8</span>
              <i className="pi pi-users" style={{ fontSize: '2rem', color: 'slateblue' }}></i>
            </div>
            <span style={{ fontSize: '1rem', color: '#7a7a7a' }}>Afiliados registrados en el sistema</span>
          </Card>
        </div>

        {/* Tarjeta Pagos Pendientes */}
        <div className="col-12 sm:col-6 md:col-3">
          <Card 
            className="card-stats"
            title="Pagos Pendientes"
            style={{ borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex align-items-center justify-content-between" style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3</span>
              <i className="pi pi-credit-card" style={{ fontSize: '2rem', color: 'slateblue' }}></i>
            </div>
            <span style={{ fontSize: '1rem', color: '#7a7a7a' }}>Afiliados con pagos pendientes</span>
          </Card>
        </div>

        {/* Tarjeta Próximas Renovaciones */}
        <div className="col-12 sm:col-6 md:col-3">
          <Card 
            className="card-stats"
            title="Próximas Renovaciones"
            style={{ borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex align-items-center justify-content-between" style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>5</span>
              <i className="pi pi-calendar" style={{ fontSize: '2rem', color: 'slateblue' }}></i>
            </div>
            <span style={{ fontSize: '1rem', color: '#7a7a7a' }}>Renovaciones en los próximos 30 días</span>
          </Card>
        </div>

        {/* Tarjeta Tasa de Renovación */}
        <div className="col-12 sm:col-6 md:col-3">
          <Card 
            className="card-stats"
            title="Tasa de Renovación"
            style={{ borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex align-items-center justify-content-between" style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>63%</span>
              <i className="pi pi-chart-line" style={{ fontSize: '2rem', color: 'slateblue' }}></i>
            </div>
            <span style={{ fontSize: '1rem', color: '#7a7a7a' }}>Porcentaje de afiliados al día</span>
          </Card>
        </div>
      </div>

      {/* Gráficas */}
      <div className="flex flex-wrap gap-4" style={{ marginTop: '20px' }}>
        <div className="flex-1 w-full md:w-6">
          <Barras />
        </div>
        <div className="flex-1 w-full md:w-6">
          <Rueda />
        </div>
      </div>
    </div>
  );
}
