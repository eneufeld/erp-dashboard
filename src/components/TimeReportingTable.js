import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

export const cols = [{
    Header: 'Date',
    accessor: 'date',
    minResizeWidth: 120,
    width: 120,
}, {
    Header: 'Customer',
    accessor: 'customer',
    minResizeWidth: 150,
    width: 150,
}, {
    Header: 'Hours',
    accessor: 'hours',
    minResizeWidth: 80,
    width: 80,
}, {
    Header: 'Comment',
    accessor: 'comment',
    minResizeWidth: 200
}];

const TimeEntriesTable = ({ isLoading, data }) => {
    const { isSignedIn } = useContext(UserContext)
    const tableData = data.filter(entry => entry.employee === 'Edgar')

    return (
        <div style={{ margin: 10 }}>
            {
                isSignedIn &&
                <ReactTable
                    data={tableData}
                    columns={cols}
                    pageSize={10}
                />
            }
        </div>
    )
}

export default TimeEntriesTable;