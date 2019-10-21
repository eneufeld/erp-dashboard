import React from 'react';

type UserContextProps = {
  isSignedIn: boolean;
  isSigningIn: boolean;
  signIn: () => void;
  signOut: () => void;
  user: gapi.auth2.GoogleUser;

};
export const UserContext = React.createContext<Partial<UserContextProps>>({
  isSignedIn: false,
  isSigningIn: false,
  signIn: () => { },
  signOut: () => { },
  user: undefined
});