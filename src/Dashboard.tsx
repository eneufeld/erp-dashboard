import React, { useState, useContext, useCallback } from 'react';
import {
  withStyles,
  Theme,
  Box,
  Typography,
  Paper,
  Container
} from '@material-ui/core';
import { Styles, WithStyles } from '@material-ui/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Header from './components/Header';
import MonthlyOverview from './components/MonthlyOverview';
import TimeReportSubmitForm from './components/TimeReportSubmitForm';
import { UserContext } from './util/UserContext';
import ProjectsOverview from './components/ProjectsOverview';

const styles: Styles<Theme, {}> = {
  app: {
    maxWidth: 1200,
    margin: '0 auto',
    marginTop: 10
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  progress: {
    marginTop: -4
  }
};
interface DashboardProps extends WithStyles<typeof styles> {};

const Dashboard: React.FC<DashboardProps> = ({ classes }) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { isSigningIn, isSignedIn } = useContext(UserContext);
  const [updateOverview, setUpdateOverview] = useState(true);

  const handleTabSelect = useCallback((_e: any, newValue: any) => {
    setSelectedTab(newValue);
  }, []);
  const triggerUpdate = useCallback(
    () =>
      setTimeout(() => {
        setUpdateOverview(!updateOverview);
      }, 2000),
    [updateOverview]
  );

  return (
    <Container fixed>
      <Header />
      {isSigningIn ? (
        <Typography variant='h4'>Logging you in</Typography>
      ) : !isSignedIn ? (
        <Typography variant='h4'>Please sign-in</Typography>
      ) : (
        <React.Fragment>
          <AppBar position='static'>
            <Tabs
              value={selectedTab}
              onChange={handleTabSelect}
              aria-label='simple tabs example'
            >
              <Tab label='Project overview' value='overview' />
              <Tab label='Report Time' value='report' />
            </Tabs>
          </AppBar>
          {selectedTab === 'report' ? (
            <Paper>
              <Box style={{ display: 'flex' }} p={2}>
                <TimeReportSubmitForm triggerUpdate={triggerUpdate} />
                <MonthlyOverview update={updateOverview} />
              </Box>
            </Paper>
          ) : (
            <Paper>
              <Box p={2}>
                <ProjectsOverview />
              </Box>
            </Paper>
          )}
        </React.Fragment>
      )}
    </Container>
  );
};

export default withStyles(styles)(Dashboard);
