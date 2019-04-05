import React, { Fragment }  from 'react';
import { UserContext } from "./UserContext";
import { Button, Chip, Avatar, AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';

const styles = {
    grow: {
        flexGrow: '1',
    },
    button: {
      color: '#fff',
      marginLeft: 10,
      marginRight: 10
    }
}

const Header = ({ classes }) => {
    return (
        <React.Fragment>
            <UserContext.Consumer>
                {
                    ({ isSignedIn, signIn, signOut, user }) => {
                        return (
                          <AppBar position="static">
                            <Toolbar>
                              <Typography
                                variant="h6"
                                color="inherit"
                                className={classes.grow}
                              >
                                Dashboard
                              </Typography>
                              {isSignedIn ? (
                                <Fragment>
                                  {
                                    user ? (
                                      <Chip
                                        avatar={
                                          <Avatar
                                            alt={user
                                              .getBasicProfile()
                                              .getName()}
                                            src={user
                                              .getBasicProfile()
                                              .getImageUrl()}
                                          />
                                        }
                                        label={user
                                          .getBasicProfile()
                                          .getName()}
                                      />
                                    ) : (
                                        <Chip label="Unknown user" />
                                      )
                                  }
                                  <Button onClick={signOut} className={classes.button}>
                                    Logout
                                  </Button>
                                </Fragment>
                              ) : (
                                <Button
                                  id="signin-button"
                                  className={classes.button}
                                  onClick={signIn}
                                >
                                  Sign In
                                </Button>
                              )}
                            </Toolbar>
                          </AppBar>
                        );
                    }
                }
            </UserContext.Consumer>
        </React.Fragment>
    )
}

export default withStyles(styles)(Header);