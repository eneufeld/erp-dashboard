import React from 'react';
import { Typography, CircularProgress, withStyles, WithStyles } from '@material-ui/core';

const styles = {
    title: {
        margin: "1rem",
        flexGrow: 1,
    }
}

const Title:React.FC<StyledTitleProps> = ({variant,title,isLoading=false,emoji, classes}) => (
  <Typography variant={variant} className={classes.title}>
    {title}{" "}
    <span role="img" aria-label="Overview of Projects">
      {emoji}
    </span>
    {isLoading ? <CircularProgress /> : null}
  </Typography>
);

const StyledTitle = withStyles(styles)(Title);

interface StyledTitleProps extends WithStyles<typeof styles> {
    variant: "h1"| "h2"| "h3"| "h4"| "h5"| "h6";
    title: string;
    isLoading?: boolean;
    emoji: string;
}

export default StyledTitle;