import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table'
import groupBy from 'lodash/groupBy'
import { isEmployee, matchesMonth } from '../utils';
import Title from './Title';

const calcDaysByCustomer = (data, employee, month, year) => {
    const tableData = data
        .filter(isEmployee(employee))
        .filter(matchesMonth(month, year));
    const dataByCustomer =  groupBy(tableData, 'customer');
    return Object.keys(dataByCustomer).map(customer => ({
        customer,
        days: dataByCustomer[customer].reduce((hours, entry) => {
          if (entry.hours) {
              return hours + parseFloat(entry.hours);
          }
          return hours
        }, 0)/8
    }));
}

const ProjectsOverview = ({ employee, data, month, year, isLoading }) => {
  const daysByCustomer = calcDaysByCustomer(data, employee, month, year);
  return (
    <div>
      <Title 
        variant="h4"
        title="Projects"
        emoji="🔨"
        isLoading={isLoading}
       />
      <ReactTable
        data={daysByCustomer}
        columns={[
          {
            Header: "Project",
            accessor: "customer",
            minResizeWidth: 200
          },
          {
            Header: "Current Days",
            accessor: "days",
            minResizeWidth: 150
          }
        ]}
        pageSize={10}
        showPaginationBottom={false}
      />
    </div>
  );
};

ProjectsOverview.propTypes = {
    employee: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        customer: PropTypes.string.isRequired,
        employee: PropTypes.string.isRequired,
        hours: PropTypes.string.isRequired,
        comment: PropTypes.string
    })),
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
}

export default ProjectsOverview;
