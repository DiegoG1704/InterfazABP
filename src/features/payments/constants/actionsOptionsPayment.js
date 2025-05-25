export const ACTIONS_OPTIONS_PAYMENT = (rowData, { onEdit}) => [
    {
        label: 'Marcar como pagado',
        icon: 'pi pi-check',
        command: () => onEdit(rowData)
    },
    // {
    //     label: 'Eliminar',
    //     icon: 'pi pi-trash',
    //     command: () => onDelete(rowData)
    // },
    // {
    //     label: 'Ver detalles',
    //     icon: 'pi pi-eye',
    //     command: () => onView(rowData)
    // }
];
