import React from 'react';
import { Typography, withStyles } from "@material-ui/core";

const styles = {
    greeting: {
        margin: 10
    }
}

const Greeting = ({ classes, user }) => {
    if (!user) {
        return null; 
    }
    const userName = user.getBasicProfile().getGivenName();
    return (
        <Typography variant="h3" className={classes.greeting}>
            Hello, {userName}!<span role="img" aria-label={`Hello ${userName}`}>👋</span>
        </Typography>
    )
}

export default withStyles(styles)(Greeting);