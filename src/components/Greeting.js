import React from 'react';
import Title from './Title'

const Greeting = ({ classes, user }) => {
    if (!user) {
        return null; 
    }
    const userName = user.getBasicProfile().getGivenName();
    return (
        <Title
            variant="h4"
            title={`Hello, ${userName}!`}
            emoji="👋"
        />
    )
}

export default Greeting;