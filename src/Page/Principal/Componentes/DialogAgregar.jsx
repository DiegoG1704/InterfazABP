import React, { useRef, useState } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Dialog } from 'primereact/dialog'
import FomularioPers from "./FomularioPers";
import FormulalarioTien from "./FormulalarioTien";
import FormularioObs from "./FormularioObs";

export default function DialogAgregar({ Visible, Close, Actualizar }) {
    const stepperRef = useRef(null);
    const [datos, setDatos] = useState({
        dni: '',
        ruc: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        distritoId: '',
        nombreBodega: '',
        metodoAfiliacion: '',
        estadoWhatsapp: '',
        estadoGrupo: '',
        referencia: '',
        correo: '',
        observaciones: '',
        codigo:'',
    });
    
    return (
        <Dialog 
            visible={Visible} 
            onHide={Close} 
            header="Agregar Usuario" 
            style={{ width: '32vw', minWidth: '350px' }} // Tamaño de la ventana
            footer={null} // Desactivar el pie de página por defecto
        >
            <div className="card flex justify-content-center">
                <Stepper 
                    linear 
                    ref={stepperRef} 
                    style={{ width: '100%' }} 
                    headerPosition="top" 
                    activeIndex={0} // Establecer el índice activo del Stepper
                    className="custom-stepper"
                >
                    <StepperPanel header="Personales">
                        <div className="flex flex-column">
                            <FomularioPers
                                datos={datos}
                                setDatos={setDatos}
                                Next={() => stepperRef.current.nextCallback()}
                            />
                        </div>
                    </StepperPanel>
                    <StepperPanel header="Tienda">
                        <div className="flex flex-column">
                            <FormulalarioTien
                                Back={() => stepperRef.current.prevCallback()}
                                Next={() => stepperRef.current.nextCallback()}
                                datos={datos}
                                setDatos={setDatos}
                            />
                        </div>
                    </StepperPanel>
                    <StepperPanel header="Observaciones">
                        <div className="flex flex-column">
                            <FormularioObs
                                Back={() => stepperRef.current.prevCallback()}
                                Close={Close}
                                datos={datos}
                                setDatos={setDatos}
                                Actualizar={Actualizar}
                            />
                        </div>
                    </StepperPanel>
                </Stepper>
            </div>
        </Dialog>
    );
}
