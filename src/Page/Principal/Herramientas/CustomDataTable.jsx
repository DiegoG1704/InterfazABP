
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from "../../../components/CustomTable/CustomTable.module.css";
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

const CustomDataTable = ({ columns, paginator, rows, rowsPerPageOptions, ...props }) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  return (
    <>
      <div className={styles.customTableHeader}>
        <p className={styles['header-title-filter']}><span className={styles["header-icon"]}><i className='pi pi-filter '></i></span>Filtrar </p>
        <div className={styles.customTableHeaderFilterBox}>
          <span className="p-input-icon-left mb-3">
            <i className="pi pi-search" />
            <InputText
              type="search"
              placeholder="Buscar..."
              onInput={(e) => setGlobalFilter(e.target.value)}
              className={styles.customTableHeaderFilterInput}
            />
          </span>
        </div>

      </div>

      <div className={styles.customTableContainer}>

        <DataTable {...props} paginator={paginator} rows={rows} rowsPerPageOptions={rowsPerPageOptions} className={styles.customTable} globalFilter={globalFilter} filterDisplay="menu">
          {columns.map((col, idx) => {
            const body = (row, bodyProps) => {
              let element = row[bodyProps.field];
              return (
                <>
                  <span className="p-column-title">{col.header}</span>
                  {element}
                </>
              );
            };

            return <Column key={idx} body={body} {...col} />;
          })}
        </DataTable>
      </div>
    </>


  )
}

export default CustomDataTable;
