import { useDispatch } from 'react-redux';
import CustomDataTable from '../../../../Page/Principal/Herramientas/CustomDataTable';
import styles from './AffiliatesList.module.css';
import { setSecondaryLoading } from '../../../../store/iuSlice';


const AffiliatesList = ({ affiliates, rowData, setRowData, showDialogPayment, fnGetPaymentsAffiliate, getDebByAffiliate }) => {

    const dispatch = useDispatch();
    const handleLoadPaymentData = async (rowData) => {
        try {
            dispatch(setSecondaryLoading(true)); // 👉 Activar spinner secundario

            const [paymentResponse, debtResponse] = await Promise.all([
                fnGetPaymentsAffiliate(rowData?.id),
                getDebByAffiliate(rowData?.id),
            ]);

            // console.log("payment", paymentResponse);
            // console.log("debt", debtResponse);

            setRowData(rowData);
            showDialogPayment(); // 👈 Mostrar modal o lo que necesites
        } catch (error) {
            console.error("Error fetching data:", error);
            // Podrías usar toast aquí si quieres notificar al usuario
        } finally {
            dispatch(setSecondaryLoading(false)); // 👉 Desactivar spinner secundario
        }
    };



    const columns = [
        {
            header: 'Nº',
            body: (_, { rowIndex }) => rowIndex + 1,
        },
        {
            header: 'Razón Social',
            field: 'nombreBodega',
            body: (row) => row.nombreBodega || '---',
        },
        {
            header: 'Responsable',
            field: 'dni',
            body: (row) => {
                const nombreCompleto = `${row.nombre ?? ''} ${row.apellido ?? ''}`.trim();
                return nombreCompleto || '---';
            },
        },
        {
            header: 'F. Último Pago',
            field: 'ultimaFecha',
            body: (row) => row.ultimaFecha || '---',
        },
        {
            header: 'Deuda',
            field: 'deuda',
            body: (row) => (
                <div className="flex align-items-center">
                    {row?.estado === "2" ? (
                        <span className={styles['tag-deuda']}>• Pendiente</span>
                    ) : (
                        <span className={styles['tag-libre']}>• Libre</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Detalle',
            body: (rowData) => (
                <i
                    className="pi pi-eye"
                    style={{ fontSize: '1.5em', color: '#2196F3', cursor: 'pointer' }}
                    title="Ver detalle"
                    onClick={() => handleLoadPaymentData(rowData)}

                ></i>
            ),
        },
    ];

    return (
        <div className=" p-4 border-round-lg">
            <CustomDataTable
                columns={columns}
                value={affiliates}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                emptyMessage="No hay afiliados para mostrar."
            />
        </div>
    );
};

export default AffiliatesList;
