import React, { Fragment, useState, useCallback, useEffect, useContext } from 'react';
import { Snackbar, withStyles, Card, CardContent, LinearProgress } from '@material-ui/core';
import Header from './Header'
import SnackbarContentWrapper from './Snackbar';
import { useTimePlanningSheet } from '../hooks';
import MonthlyOverview from './MonthlyOverview';
import TimeReportSubmitForm from './TimeReportSubmitForm';
import Greeting from './Greeting';
import { UserContext } from './UserContext';
import ProjectsOverview from './ProjectsOverview';

const styles = {
  app: {
    maxWidth: 1200,
    margin: '0 auto',
    marginTop: 10
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  progress: {
      marginTop: -4 
  }
}

const Dashboard = ({ classes }) => {
    const { data, fetch, error, isLoading } = useTimePlanningSheet("Data!B4:T");
    const entries = data.filter(d => d.date !== undefined)
    const [isSnackbarOpen, setSnackbarOpen] = useState(false)
    const closeSnackbar = useCallback(() => setSnackbarOpen(false));
    useEffect(() => error && setSnackbarOpen(true), [error])
    const { user, isSigningIn, isSignedIn } = useContext(UserContext);

    return (
      <Fragment>
        <Header />
        {isLoading && <LinearProgress className={classes.progress} />}
        <div className={classes.app}>
          <div className={classes.container}>
            {error && (
              <Snackbar
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
                open={isSnackbarOpen}
                autoHideDuration={5000}
                onClose={closeSnackbar}
              >
                <SnackbarContentWrapper
                  variant="error"
                  message={error.message}
                />
              </Snackbar>
            )}
            {isSigningIn ? (
              <div>Logging you in</div>
            ) : !isSignedIn ? (
              <div>Please sign-in</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex" }}>
                  <Card>
                    <Greeting user={user} />
                    <CardContent>
                      <TimeReportSubmitForm
                        onSubmit={fetch}
                        isLoading={isLoading}
                      />
                    </CardContent>
                  </Card>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <MonthlyOverview
                      isLoading={isLoading}
                      data={entries}
                      error={error}
                      employee="Edgar"
                      month={4}
                      year={2018}
                    />
                  </div>
                </div>
                  <ProjectsOverview 
                      isLoading={isLoading}
                      data={entries}
                      error={error}
                      employee="Edgar"
                      month={4}
                      year={2018}
                  />
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
}

export default withStyles(styles)(Dashboard);
