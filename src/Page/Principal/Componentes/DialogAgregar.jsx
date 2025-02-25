import React, { useRef, useState } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import FomularioPers from "./FomularioPers";
import FormulalarioTien from "./FormulalarioTien";
import FormularioObs from "./FormularioObs";

export default function DialogAgregar({Visible,Close,Actualizar}) {
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
    });
    
  return (
    <Dialog visible={Visible} onHide={Close} header='Agregar Usuario' style={{height:'75%'}}>
        <div className="card flex justify-content-center">
        <Stepper linear ref={stepperRef} style={{ flexBasis: '50rem' }} headerPosition="top">
            <StepperPanel header="Personales">
                <div className="flex flex-column h-12rem">
                    <FomularioPers
                    datos={datos}
                    setDatos={setDatos}
                    Next={() => stepperRef.current.nextCallback()}
                    />
                </div>
            </StepperPanel>
            <StepperPanel header="Tienda">
                <div className="flex flex-column h-12rem">
                    <FormulalarioTien
                        Back={() => stepperRef.current.prevCallback()}
                        Next={() => stepperRef.current.nextCallback()}
                        datos={datos}
                        setDatos={setDatos}
                    />
                </div>
            </StepperPanel>
            <StepperPanel header="Observaciones">
                <div className="flex flex-column h-12rem">
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
  )
}        