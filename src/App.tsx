import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { initClient, signIn, signOut } from './util/auth';
import { UserContext } from './util/UserContext';
import Dashboard from './Dashboard';
import { MonthContext, MONTH } from './util/MonthContext';

const theme = createMuiTheme({});

const App: React.FC = () => {
  const [isSigningIn, setSigningIn] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<gapi.auth2.GoogleUser>();
  const onSignOut = useCallback(() => {
    setSigningIn(false);
    setSignedIn(false);
    setUser(undefined);
  }, []);
  useEffect(() => {
    const onSignInSuccess = (
      isSignedIn: boolean,
      user: gapi.auth2.GoogleUser
    ) => {
      setSignedIn(isSignedIn);
      setSigningIn(false);
      setUser(user);
      document.title=`Dashboard ${user.getBasicProfile().getGivenName()}`
    };
    gapi.load('client', initClient(onSignInSuccess, onSignOut));
    return () => {
      setSignedIn(false);
      setUser(undefined);
    };
  }, [onSignOut]);
  const [month, setMonth] = useState<MONTH>(MONTH.CURRENT);
  return (
    <MuiThemeProvider theme={theme}>
      <UserContext.Provider
        value={{
          isSignedIn,
          signIn: () => {
            setSigningIn(true);
            signIn(() => {}, onSignOut);
          },
          signOut,
          isSigningIn,
          user
        }}
      >
        <MonthContext.Provider
          value={{
            month,
            setMonth
          }}
        >
          <Dashboard />
        </MonthContext.Provider>
      </UserContext.Provider>
    </MuiThemeProvider>
  );
};

export default App;
