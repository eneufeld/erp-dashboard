import React, { useContext, useState, useEffect } from 'react';
import ReactTable, { CellInfo } from 'react-table';
import { UserContext } from '../util/UserContext';
import {
  loadGeneralData,
  loadProjectData,
  ProjectOverview,
  GeneralData
} from '../util/sheet';
import { Grid, Typography, Box, CircularProgress } from '@material-ui/core';
import { MonthContext, MONTH } from '../util/MonthContext';

const getProjectData = (
  isSignedIn: boolean = false,
  user: gapi.auth2.GoogleUser | undefined,
  month: MONTH = MONTH.CURRENT,
  setError: (error: Error | undefined) => void,
  setOverview: (data: ProjectOverview[]) => void,
  setGeneral: (data: GeneralData | undefined) => void,
  setLoading: (loading: boolean) => void
) => {
  if (isSignedIn && user) {
    const eMail = user!.getBasicProfile().getEmail();
    const userName = eMail.substring(0, eMail.indexOf('@'));
    setLoading(true);
    let loadingGeneralData = true;
    let loadingProjectOverviewData = true;
    const setLoadingStatues = () => {
      if (!loadingGeneralData && !loadingProjectOverviewData) {
        setLoading(false);
      }
    };
    loadGeneralData(userName, month, (data: GeneralData) => {
      setError(undefined);
      setGeneral(data);
      loadingGeneralData = false;
      setLoadingStatues();
    }, (error:Error) => {
      setError(error);
      setGeneral(undefined);
      loadingGeneralData = false;
      setLoadingStatues();
    });
    loadProjectData(userName, month, (data: ProjectOverview[]) => {
      setError(undefined);
      setOverview(data);
      loadingProjectOverviewData = false;
      setLoadingStatues();
    }, (error:Error) => {
      setError(error);
      setOverview([]);
      loadingProjectOverviewData = false;
      setLoadingStatues();
    });
  }
};
const renderStyledCell = (row: CellInfo) => (
  <div className={'center status_' + (row.value > 0 ? 'good' : 'bad')}>
    {row.value}
  </div>
);
const ProjectsOverview: React.FC = () => {
  const { isSignedIn, user } = useContext(UserContext);
  const { month } = useContext(MonthContext);
  const [error, setError] = useState<Error>();
  const [overview, setOverview] = useState<ProjectOverview[]>([]);
  const [general, setGeneral] = useState<GeneralData>();
  const [isLoading, setLoading] = useState(true);

  useEffect(
    () =>
      getProjectData(
        isSignedIn,
        user,
        month,
        setError,
        setOverview,
        setGeneral,
        setLoading
      ),
    [isSignedIn, month, user]
  );

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        <Grid item>
          <Typography variant='h4'>Loading Data</Typography>
        </Grid>
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container direction='column' spacing={3}>
        <Grid item>
          <Grid container justify='center' alignItems='center'>
            <Grid item xs={4}>
              <Typography variant='h6'>Current Days</Typography>
            </Grid>
            <Grid item xs={2}>
              <Box>{general!.current}</Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6'>Total assigned days</Typography>
            </Grid>
            <Grid item xs={2}>
              <Box>{general!.total}</Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6'>Predicted Gap in days</Typography>
            </Grid>
            <Grid item xs={2}>
              <Box className={'status_' + (general!.gap > 0 ? 'good' : 'bad')}>
                {general!.gap}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6'>Vacation Days</Typography>
            </Grid>
            <Grid item xs={2}>
              <Box>{general!.vacation}</Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6'>Remaining Assigned days</Typography>
            </Grid>
            <Grid item xs={2}>
              <Box>{general!.remaining}</Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6'>Holidays</Typography>
            </Grid>
            <Grid item xs={2}>
              <Box>{general!.holidays}</Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          {error ? (
            <label>{JSON.stringify(error)}</label>
          ) : (
            <ReactTable
              data={overview}
              columns={[
                {
                  Header: 'Project',
                  accessor: 'name',
                  minWidth: 200,
                  className: 'center'
                },
                {
                  Header: 'Gap in Days',
                  accessor: 'gap',
                  minWidth: 150,
                  Cell: renderStyledCell
                },
                {
                  Header: 'Assigned Days',
                  accessor: 'total',
                  minWidth: 150,
                  className: 'center'
                },
                {
                  Header: 'Current Days',
                  accessor: 'current',
                  minWidth: 150,
                  className: 'center'
                }
              ]}
              pageSize={10}
              showPaginationBottom={false}
              resizable={false}
              sortable={false}
            />
          )}
        </Grid>
      </Grid>
    );
  }
};

export default ProjectsOverview;
