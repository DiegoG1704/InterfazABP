import { useEffect, useRef, useState } from "react"
import { TabView, TabPanel } from "primereact/tabview"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Menu } from "primereact/menu"

import styles from "./AffiliatesDialog.module.css"
import CustomDialog from "../../../../../components/Dialog/CustomDialog"
import { STATUS_PAYMENTS_AFFILIATES } from "../../../constants/statusPayments"
import { ACTIONS_OPTIONS_PAYMENT } from "../../../constants/actionsOptionsPayment"
import { Toast } from "primereact/toast"
import { showToast, showToastWithErrors } from "../../../../../utils/showToast"


const AffiliatesDialog = ({
    row,
    visible,
    hideDialogPayment,
    selectedAffiliatePayment,
    selectedAffiliateDebt,
    updatePaymentAffiliate,
    fnGetPaymentsAffiliate, getDebByAffiliate
}) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [menuRowData, setMenuRowData] = useState(null)
    const [menuItems, setMenuItems] = useState([])
    const menuRef = useRef(null)
    const toastRef = useRef(null)

    const estadoTemplate = (rowData) => {
        const statusClass =
            rowData.estado === "2"
                ? styles.pagado
                : rowData.estado === "1"
                    ? styles.programado
                    : styles.pendiente

        return (
            <span className={statusClass}>
                {STATUS_PAYMENTS_AFFILIATES?.[rowData.estado]?.label}
            </span>
        )
    }
    const handleUpdatePayment = async (rowData) => {
        const response = await updatePaymentAffiliate(row?.id, { anio: rowData.anio })
        console.log("response", response)
        if (response?.status === 200) {
            showToast("success", "Operación exitosa", "Pago actualizado correctamente", toastRef)
            await fnGetPaymentsAffiliate(row?.id)
            await getDebByAffiliate(row?.id)

        }else{
            showToastWithErrors("error", "Error", response?.data, toastRef)
        }
    }

    const handleMenuClick = (event, rowData) => {
        setMenuRowData(rowData)

        const items = ACTIONS_OPTIONS_PAYMENT(rowData, {
            onEdit: () => {
                handleUpdatePayment(rowData)
            },
            onDelete: () => {
                console.log("Eliminar", rowData)
            },
            onView: () => {
                console.log("Ver detalles", rowData)
            }
        })

        setMenuItems(items)
        menuRef.current.toggle(event)
    }

    const header = (
        <div className={styles.tableHeader}>
            {/* Botones condicionales si deseas activarlos más adelante */}
        </div>
    )

    const paginatorTemplate = {
        layout: "PrevPageLink PageLinks NextPageLink",
        PrevPageLink: (options) => (
            <button
                type="button"
                className={options.className}
                onClick={options.onClick}
                disabled={options.disabled}
            >
                <span className="pi pi-chevron-left"></span>
                <span className={styles.paginatorText}>Previo</span>
            </button>
        ),
        NextPageLink: (options) => (
            <button
                type="button"
                className={options.className}
                onClick={options.onClick}
                disabled={options.disabled}
            >
                <span className={styles.paginatorText}>Next</span>
                <span className="pi pi-chevron-right"></span>
            </button>
        ),
        PageLinks: (options) => {
            if (
                (options.view.startPage === options.page && options.view.startPage !== 0) ||
                (options.view.endPage === options.page && options.page + 1 !== options.totalPages)
            ) {
                return (
                    <span className={options.className} style={{ userSelect: "none" }}>
                        ...
                    </span>
                )
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                </button>
            )
        }
    }

    return (
        <CustomDialog
            visible={visible}
            onhide={hideDialogPayment}
            footer={<></>}
            title={`Pagos  "${row?.nombreBodega}"`}
            iconClassName="pi pi-clipboard"
            width="90%"
        >
            <Toast ref={toastRef}position="bottom-right" />
            <div className={styles.dialogContent}>
                <TabView
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                    className={styles.tabView}
                >
                    <TabPanel header="Pagos">
                        <DataTable
                            value={selectedAffiliatePayment?.pagos}
                            className={styles.dataTable}
                            header={header}
                            paginator
                            rows={6}
                            paginatorTemplate={paginatorTemplate}
                            paginatorClassName={styles.paginator}
                        >
                            <Column header="Item" className={styles.column} body={(_, options) => options.rowIndex + 1}/>
                            <Column field="anio" header="Año" className={styles.column} />
                            <Column field="fecha" header="Fecha Pago" className={styles.column} />
                            <Column field="fechaVenc" header="F. Vencimiento" className={styles.column} />
                            <Column field="estado" header="Estado" body={estadoTemplate} className={styles.column} />
                            <Column
                                body={(rowData) => {
                                    if (rowData?.estado !== "2") {
                                        return (
                                            <>
                                                <Button
                                                    icon="pi pi-ellipsis-v"
                                                    className={styles.actionButton}
                                                    onClick={(e) => handleMenuClick(e, rowData)}
                                                />
                                            </>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </DataTable>
                    </TabPanel>

                    <TabPanel header="Deudas Pendientes">
                        <DataTable
                            value={selectedAffiliateDebt}
                            className={styles.dataTable}
                            header={header}
                            paginator
                            rows={6}
                            paginatorTemplate={paginatorTemplate}
                            paginatorClassName={styles.paginator}
                            
                            emptyMessage="No hay deudas pendientes"
                        >
                            <Column field="id" header="Item" className={styles.column} />
                            <Column field="anio" header="Año" className={styles.column} />
                            <Column field="estado" header="Estado" body={estadoTemplate} className={styles.column} />
                            <Column field="fechaVenc" header="Fecha de vencimiento" className={styles.column} />
                            <Column
                                body={(rowData) => (
                                    <Button
                                        icon="pi pi-ellipsis-v"
                                        className={styles.actionButton}
                                        onClick={(e) => handleMenuClick(e, rowData)}
                                    />
                                )}
                            />
                        </DataTable>
                    </TabPanel>
                </TabView>
                <Menu model={menuItems} popup ref={menuRef} />
            </div>
        </CustomDialog>
    )
}

export default AffiliatesDialog
