import styles from './payment.module.css'
// import { Button } from 'primereact/button';
import AffiliatesList from './components/affiliates/AffiliatesList';
import { usePayment } from './hook/useAffilateToPayment';
// import AffiliatesDialog from './components/affiliates/affiliatesDialog/AffiliatesDialog';
import AffiliatesDialog from './components/affiliates/affiliatesDialog/AffiliatesDialog';
import { useState } from 'react';

const PaymetPage = () => {
    const { loadingAffiliates, error,
        getPaymentByAffiliate,
        affiliates, selectedAffiliatePayment,
        getDebByAffiliate, selectedAffiliateDebt, updatePaymentAffiliate, loading } = usePayment();

    const [rowData, setRowData] = useState(null);
    const [visibleDialogPayment, setVisibleDialogPayment] = useState(false);
    const showDialogPayment = () => {
        setVisibleDialogPayment(true);
    }
    const hideDialogPayment = () => {
        setVisibleDialogPayment(false);
    }

    // if (loadingAffiliates) {
    //     return (
    //         <div className={styles.containerPaymentModule}>
    //             <p>Cargando datos de pagos...</p>
    //         </div>
    //     );
    // }

    // if (error) {
    //     return (
    //         <div className={styles.containerPaymentModule}>
    //             <p>Error al cargar los datos: {error.message}</p>
    //         </div>
    //     );
    // }
    if (loading) {
        return (
            <div className={styles.containerPaymentModule}>
                <p style={{ color: "red" }}>Cargando datos de pagos...</p>
            </div>
        );
    }

    return (
        <div className={styles.containerPaymentModule}>
            <header className={styles["header"]}>
                <h3 className={styles["header-title-module"]}>
                    LISTA DE PAGOS
                </h3>
                <div className="flex gap-5">
                    <div className={styles["header-description-module"]}>
                        <p>En esta sección puedes visualizar todos los pagos registrados de tus afiliados bodegueros,
                            con información clave como la fecha de pago, nombre del afiliado, tipo de afiliación y el monto abonado. También puedes consultar el
                            estado del pago, el método utilizado y cualquier documento relacionado. Usa esta vista
                            para llevar un control preciso y eficiente del cumplimiento de los pagos.</p>
                    </div>
                </div>
            </header>

            <div className='flex justify-content-end'>
                {/* <Button  className='btn-sign-out' outlined><LogOut className="h-4 w-4 " />Cerrar Sesión</Button> */}
            </div>
            <main>
                {loadingAffiliates ? (
                    <p>Cargando datos de pagos...</p>
                ) : error ? (
                    <p>Error al cargar los datos: {error.message}</p>
                ) : (
                    <AffiliatesList affiliates={affiliates} rowData={rowData} setRowData={setRowData}
                        showDialogPayment={showDialogPayment} fnGetPaymentsAffiliate={getPaymentByAffiliate}
                        getDebByAffiliate={getDebByAffiliate} />
                )}
            </main>
            <AffiliatesDialog fnGetPaymentsAffiliate={getPaymentByAffiliate} row={rowData} setRowData={setRowData}
                hideDialogPayment={hideDialogPayment} visible={visibleDialogPayment}
                selectedAffiliatePayment={selectedAffiliatePayment} selectedAffiliateDebt={selectedAffiliateDebt}
                updatePaymentAffiliate={updatePaymentAffiliate}
                getDebByAffiliate={getDebByAffiliate}
            />


        </div>
    );
};

export default PaymetPage;
