import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const CustomDataTable = ({ columns, paginator, rows, rowsPerPageOptions, ...props }) => (
  <DataTable {...props} paginator={paginator} rows={rows} rowsPerPageOptions={rowsPerPageOptions}>
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
);

export default CustomDataTable;
