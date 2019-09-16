import React from 'react';
import PropTypes from 'prop-types';
import { Typography, CircularProgress, withStyles } from '@material-ui/core';

const styles = {
    title: {
        margin: "1rem", 
    }
}

const Title = ({ variant, title, isLoading, emoji, classes }) => (
  <Typography variant={variant} className={classes.title}>
    {title}{" "}
    <span role="img" aria-label="Overview of Projects">
      {emoji}
    </span>
    {isLoading ? <CircularProgress /> : null}
  </Typography>
);

const StyledTitle = withStyles(styles)(Title);

StyledTitle.propTypes = {
    variant: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
    title: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    emoji: PropTypes.string
}

StyledTitle.defaultProps = {
    isLoading: false
}

export default StyledTitle;