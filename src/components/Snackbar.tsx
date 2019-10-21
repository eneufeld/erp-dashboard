import React from 'react';
import { IconButton, SnackbarContent, withStyles, Theme } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green } from '@material-ui/core/colors';


const variantIcon:any = {
  success: CheckCircleIcon,
  error: ErrorIcon,
};

const styles = (theme:Theme) => ({
  error: {
    backgroundColor: red[400]
  },
  success: {
    backgroundColor: green[400],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(2),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});


const SnackbarContentWrapper:React.FC<any> = (props) =>{
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={`${classes[variant]} ${className}`}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes!.message}>
          <Icon className={`${classes.icon} ${classes.iconVariant}`} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

export default withStyles(styles)(SnackbarContentWrapper);