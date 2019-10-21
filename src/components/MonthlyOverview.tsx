import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../util/UserContext';
import 'react-table/react-table.css';
import Title from './Title';
import { DailySum, loadOverviewData } from '../util/sheet';
import { MonthContext, MONTH } from '../util/MonthContext';

export const cols = [
  {
    Header: 'Date',
    accessor: 'date',
    minResizeWidth: 120,
    width: 120
  },
  {
    Header: 'Customer',
    accessor: 'customer',
    minResizeWidth: 150,
    width: 150
  },
  {
    Header: 'Hours',
    accessor: 'hours',
    minResizeWidth: 80,
    width: 80
  },
  {
    Header: 'Comment',
    accessor: 'comment',
    minResizeWidth: 200
  }
];
const getOverviewData = (
  isSignedIn: boolean = false,
  user: gapi.auth2.GoogleUser | undefined,
  month: MONTH = MONTH.CURRENT,
  setError: (error: Error | undefined) => void,
  setOverview: (data: DailySum[]) => void,
  setLoading: (loading: boolean) => void
) => {
  if (isSignedIn && user) {
    const eMail = user!.getBasicProfile().getEmail();
    const userName = eMail.substring(0, eMail.indexOf('@'));
    setLoading(true);
    loadOverviewData(
      userName,
      month,
      (data: DailySum[]) => {
        setError(undefined);
        setOverview(data);
        setLoading(false);
      },
      (error: Error) => {
        setError(error);
        setOverview([]);
        setLoading(false);
      }
    );
  }
};
interface WorkDayProps {
  date: string;
  hours: number;
}
const WorkDay: React.FC<WorkDayProps> = ({ date, hours }) => {
  const dateDisplayString = new Date(date).toLocaleDateString();
  return (
    <div>
      {dateDisplayString}:
      <span
        style={{
          marginLeft: '0.5rem',
          fontWeight: 600,
          color: hours >= 8 ? '#81c784' : '#e57373'
        }}
      >
        {hours}
      </span>
    </div>
  );
};
interface MonthlyOverviewProps {
  update: boolean;
}
const MonthlyOverview: React.FC<MonthlyOverviewProps> = ({ update }) => {
  const { isSignedIn, user } = useContext(UserContext);
  const { month } = useContext(MonthContext);
  const [error, setError] = useState<Error>();
  const [overview, setOverview] = useState<DailySum[]>([]);
  const [isLoadingOverview, setLoadingOverview] = useState(true);
  useEffect(
    () =>
      getOverviewData(
        isSignedIn,
        user,
        month,
        setError,
        setOverview,
        setLoadingOverview
      ),
    [isSignedIn, month, user, update]
  );

  return error ? (
    <label>{JSON.stringify(error)}</label>
  ) : (
    <div
      style={{
        margin: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      <Title
        variant='h4'
        title='Overview'
        emoji='👓'
        isLoading={isLoadingOverview}
      />
      <div style={{ margin: 10 }}>
        {isSignedIn
          ? overview.map(day => {
              return (
                <WorkDay key={day.date} date={day.date} hours={day.total} />
              );
            })
          : null}
      </div>
    </div>
  );
};

export default MonthlyOverview;
