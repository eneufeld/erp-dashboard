import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy'
import head from 'lodash/head'
import { UserContext } from './UserContext';
import 'react-table/react-table.css'
import { isEmployee, matchesMonth } from '../utils';
import Title  from './Title';

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

const WorkDay = ({ date, hours }) => {
  const dateDisplayString = new Date(date).toLocaleDateString();
  return (
    <div>
      {dateDisplayString}:
      <span style={{ marginLeft: "0.5rem", fontWeight: 600, color: hours >= 8 ? '#81c784' : '#e57373' }}>{hours}</span>
    </div>
  );
};

const calcHoursByDay = (data, employee, month, year) => {
  const tableData = data
    .filter(isEmployee(employee))
    .filter(matchesMonth(month, year));
  const tableDataByDate = groupBy(tableData, "date");
  return Object.keys(tableDataByDate).map(date => {
    return {
      [date]: tableDataByDate[date].reduce((hours, e) => {
        if (e.hours) {
          return hours + parseFloat(e.hours);
        }
        return hours;
      }, 0)
    };
  });
};

const MonthlyOverview = ({ data, employee, month, year, isLoading }) => {
    const { isSignedIn } = useContext(UserContext)
    const hoursByDay = calcHoursByDay(data, employee, month, year);
    return (
      <div style={{
        margin: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}>
        <Title
          variant="h4"
          title="Overview"
          emoji="👓"
          isLoading={isLoading}
        />
        <div style={{ margin: 10 }}>
          {isSignedIn
            ? hoursByDay.map(obj => {
                const date = head(Object.keys(obj));
                return <WorkDay key={date} date={date} hours={obj[date]} />;
              })
            : null}
        </div>
      </div>
    );
}

MonthlyOverview.propTypes = {
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
    employee: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        customer: PropTypes.string.isRequired,
        employee: PropTypes.string.isRequired,
        hours: PropTypes.string.isRequired,
        comment: PropTypes.string
    }))
}

export default MonthlyOverview;
