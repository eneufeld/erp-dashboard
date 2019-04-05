import React from 'react';
import classNames from 'classnames';
import { IconButton, SnackbarContent, withStyles } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';


const variantIcon = {
//  success: CheckCircleIcon,
//  warning: WarningIcon,
  error: ErrorIcon,
//  info: InfoIcon,
};

const styles = theme => ({
  error: {
    backgroundColor: red[400]
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

function SnackbarContentWrapper(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
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