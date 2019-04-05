import React, { Fragment, useState, useCallback, useEffect, useContext } from 'react';
import { Snackbar, withStyles, Typography, Card, CardContent, LinearProgress } from '@material-ui/core';
import Header from './Header'
import SnackbarContentWrapper from './Snackbar';
import { useTimePlanningSheet } from '../hooks';
import TimeReportingTable from './TimeReportingTable';
import TimeReportSubmitForm from './TimeReportSubmitForm';
import Greeting from './Greeting';
import { UserContext } from './UserContext';

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
    const [isSnackbarOpen, setSnackbarOpen] = useState(false)
    const closeSnackbar = useCallback(() => setSnackbarOpen(false));
    useEffect(() => error && setSnackbarOpen(true), [error])
    const { user, isSigningIn, isSignedIn } = useContext(UserContext);

    return (
        <Fragment>
            <Header />
            { isLoading && <LinearProgress className={classes.progress}/>}
            <div className={classes.app}>
                <div className={classes.container}>
                    {
                        error &&
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
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
                    }
                    {
                        isSigningIn ?
                            <div>Logging you in</div> :
                            !isSignedIn ?
                                <div>Please sign-in</div> :
                                <Fragment>
                                    <Greeting user={user} />
                                    <Card>
                                        <CardContent>
                                            <TimeReportSubmitForm onSubmit={fetch} isLoading={isLoading} />
                                        </CardContent>
                                    </Card>
                                    <Typography variant="h4">Overview <span role="img" aria-label="overview">👓</span></Typography>
                                    <TimeReportingTable
                                        data={data}
                                        error={error}
                                    />
                                </Fragment>
                    }
                </div>
            </div>
        </Fragment>
    )
}

export default withStyles(styles)(Dashboard);