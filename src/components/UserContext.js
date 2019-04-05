import React from 'react';

let UserContext;
const {
  Provider,
  Consumer
} = (UserContext = React.createContext());

export {
  Provider as UserProvider,
  Consumer as UserConsumer,
  UserContext
};