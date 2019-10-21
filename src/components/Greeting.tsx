import React from 'react';
import Title from './Title';
import { UserContext } from '../util/UserContext';

const Greeting: React.FC = () => {
  return (
    <UserContext.Consumer>
      {({ user }) => {
        if (!user) {
          return null;
        }
        return (
          <Title
            variant='h4'
            title={`Hello, ${user.getBasicProfile().getGivenName()}!`}
            emoji='👋'
          />
        );
      }}
    </UserContext.Consumer>
  );
};
export default Greeting;
