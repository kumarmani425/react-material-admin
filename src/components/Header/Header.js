import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material';
import { Menu as MenuIcon, Person as AccountIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import classNames from 'classnames';
import {jwtDecode} from 'jwt-decode';

// Images
import profile from '../../images/dadi1.png';
import config from '../../config';

// Styles
import useStyles from './styles';

// Components
import { Typography, Avatar } from '../Wrappers/Wrappers';

export default function Header(props) {
  const classes = useStyles();
  const theme = useTheme();

  const [profileMenu, setProfileMenu] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSmall, setSmall] = useState(false);

  function startTokenExpirationTimer(token) {
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000; 
    const timeLeft = expirationTime - Date.now();
    return timeLeft;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAutoLogout(startTokenExpirationTimer(token));
      const user = JSON.parse(localStorage.getItem("user"));
      console.log('user',user)
      setCurrentUser(user);
    }
  }, []);

  const setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("theme");
      props.navigate("/login");
    }, milliseconds);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowWidthChange);
    handleWindowWidthChange();
    return () => {
      window.removeEventListener('resize', handleWindowWidthChange);
    };
  }, []);

  function handleWindowWidthChange() {
    const windowWidth = window.innerWidth;
    const breakpointWidth = theme.breakpoints.values.md;
    setSmall(windowWidth < breakpointWidth);
  }

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <IconButton
          color='inherit'
          onClick={() => {}}
          className={classNames(classes.headerMenuButton, classes.headerMenuButtonCollapse)}
        >
          {(!isSmall) ? (
            <ArrowBackIcon classes={{ root: classNames(classes.headerIcon, classes.headerIconCollapse) }} />
          ) : (
            <MenuIcon classes={{ root: classNames(classes.headerIcon, classes.headerIconCollapse) }} />
          )}
        </IconButton>
        <Typography variant='h6' weight='medium' className={classes.logotype}>
          Sriphala Mitra
        </Typography>
        <div className={classes.grow} />
        <IconButton
          aria-haspopup='true'
          color='inherit'
          className={classes.headerMenuButton}
          aria-controls='profile-menu'
          onClick={(e) => setProfileMenu(e.currentTarget)}
        >
          <Avatar
            alt={currentUser?.name}
            src={currentUser?.avatar || profile}
            classes={{ root: classes.headerIcon }}
          >
            {currentUser?.firstName?.[0]}
          </Avatar>
        </IconButton>
        <Typography style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
          <div className={classes.profileLabel}>Hi,&nbsp;</div>
          <Typography weight='bold' className={classes.profileLabel}>
            {currentUser?.firstName}
          </Typography>
        </Typography>
        <Menu
          id='profile-menu'
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant='h4' weight='medium'>
              {currentUser?.firstName}
            </Typography>
          </div>
          <MenuItem className={classNames(classes.profileMenuItem, classes.headerMenuItem)}>
            <AccountIcon className={classes.profileMenuIcon} />
            <Link to='/app/user/edit' style={{ textDecoration: 'none' }}>Profile</Link>
          </MenuItem>
          <div className={classes.profileMenuUser}>
            <Typography className={classes.profileMenuLink} color='primary' onClick={() => setAutoLogout(0)}>
              Sign Out
            </Typography>
          </div>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
