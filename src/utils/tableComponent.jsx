import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';

const customStyles = {
      
    headCells: {
      style: {
        fontWeight: 'bold',
        borderRight: '1px solid #EDF2F7',
      },
    },
    cells: {
      style: {
        borderRight: '1px solid #EDF2F7',
      },
    },
};

const TableComponent = ({columns,datas}) => {
    const [data, setData] = useState([]);
    const [column, setColumn] = useState([]);

    useEffect(() => {
        setData(datas);
        setColumn(columns)
    },[datas])
  return (
    
        <DataTable
			columns={column}
			data={data}
            persistTableHead
            noDataComponent="Belum ada data"
            pagination
            customStyles={customStyles}
		/>
    
  )
}

export default TableComponent