import React, { useCallback } from 'react';
import { UserContext } from '../util/UserContext';
import {
  Button,
  Chip,
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  withStyles,
  WithStyles,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu
} from '@material-ui/core';
import Title from './Title';
import { MonthContext, MONTH } from '../util/MonthContext';
const styles = {
  grow: {
    flexGrow: 1
  },
  button: {
    color: '#fff',
    marginLeft: 10,
    marginRight: 10
  }
};
interface HeaderProps extends WithStyles<typeof styles> {}

const Header: React.FC<HeaderProps> = ({ classes }) => {
  return (
    <React.Fragment>
      <UserContext.Consumer>
        {({ isSignedIn, signIn, signOut, user }) => {
          return (
            <MonthContext.Consumer>
              {({ month, setMonth }) => {
                return (
                  <AppBar position='static'>
                    <Toolbar>
                      <Grid
                        container
                        justify='space-between'
                        alignItems='center'
                      >
                        <Grid item>
                          {!user ? (
                            <Typography variant='h6' color='inherit'>
                              Dashboard
                            </Typography>
                          ) : (
                            <Title
                              variant='h4'
                              title={`Hello, ${user
                                .getBasicProfile()
                                .getGivenName()}!`}
                              emoji='👋'
                            />
                          )}
                        </Grid>

                        <Grid item>
                          <MonthMenu month={month!} setMonth={setMonth!} />
                        </Grid>
                        {isSignedIn ? (
                          <Grid item>
                            {user ? (
                              <Chip
                                avatar={
                                  <Avatar
                                    alt={user.getBasicProfile().getName()}
                                    src={user.getBasicProfile().getImageUrl()}
                                  />
                                }
                                label={user.getBasicProfile().getName()}
                              />
                            ) : (
                              <Chip label='Unknown user' />
                            )}
                            <Button
                              onClick={signOut}
                              className={classes.button}
                            >
                              Logout
                            </Button>
                          </Grid>
                        ) : (
                          <Button
                            id='signin-button'
                            className={classes.button}
                            onClick={signIn}
                          >
                            Sign In
                          </Button>
                        )}
                      </Grid>
                    </Toolbar>
                  </AppBar>
                );
              }}
            </MonthContext.Consumer>
          );
        }}
      </UserContext.Consumer>
    </React.Fragment>
  );
};

export default withStyles(styles)(Header);

const options = ['Previous Month', 'Current Month', 'Next Month'];
interface MonthMenuProps {
  month: MONTH;
  setMonth: (month: MONTH) => void;
}
const MonthMenu:React.FC<MonthMenuProps> = ({ month, setMonth }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickListItem = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuItemClick = useCallback(
    (index: number) => {
      if (setMonth) {
        setMonth(index);
      }
      setAnchorEl(null);
    },
    [setMonth]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <div>
      <List component='nav' aria-label='selected month'>
        <ListItem
          button
          aria-haspopup='true'
          aria-controls='lock-menu'
          aria-label='selected month'
          onClick={handleClickListItem}
        >
          <ListItemText primary={options[month || 1]} />
        </ListItem>
      </List>
      <Menu
        id='lock-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            selected={index === month}
            onClick={() => handleMenuItemClick(index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
