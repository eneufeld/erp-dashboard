import React, { useEffect, useState, Fragment } from 'react';
import './App.css';
import { initClient } from '../auth'
import { UserContext } from './UserContext';
import { signIn, signOut } from '../auth';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { blue, red, green } from '@material-ui/core/colors';
import Dashboard from './Dashboard';

const theme = createMuiTheme({
   palette: {
    primary: blue,
    secondary: green,
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  appBar: {
    height: 60,
  },
});

const App = () => {
  const [isSigningIn, setSigningIn] = useState(false);
  const [isSignedIn, setSignedIn] = useState(null)
  const [user, setUser] = useState(null)
  useEffect(
    () => {
      const onSignIn = (isSignedIn, user) => {
        setSignedIn(isSignedIn);
        setSigningIn(false);
        setUser(user);
      };
      const onSignOut = () => {
        setSignedIn(false);
        setUser(null);
      };
      window.gapi.load('client', initClient(onSignIn, onSignOut));
      return () => {
        setSignedIn(false);
        setUser(null);
      }
    },
    []
  );

  return (
    <Fragment>
      <div className="background" />
      <MuiThemeProvider theme={theme}>
        <UserContext.Provider value={{
          isSignedIn,
          signIn,
          signOut,
          isSigningIn,
          user
        }}>
          <Dashboard />
        </UserContext.Provider>
      </MuiThemeProvider>
    </Fragment>
  );
}

export default App;
