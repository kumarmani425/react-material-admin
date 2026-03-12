import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme, Box } from '@mui/material';
import { Menu as MenuIcon, Person as AccountIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import classNames from 'classnames';
import { jwtDecode } from 'jwt-decode';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
// Images
import profile from '../../images/dadi1.png';
import logo from '../../images/logo.png'
import config from '../../config';
import LiveClock from '../LiveClock/LiveClock';

// Styles
import useStyles from './styles';

// Components
import { Typography, Avatar } from '../Wrappers/Wrappers';
// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

export default function Header(props) {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  // global
  var layoutState = useLayoutState();

  var layoutDispatch = useLayoutDispatch();


  const [profileMenu, setProfileMenu] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSmall, setSmall] = useState(false);


  function startTokenExpirationTimer(token) {
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;
    const timeLeft = expirationTime - Date.now();
    return timeLeft;
  }
  const userDetails = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setCurrentUser(user);
      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp * 1000;
      const timeLeft = expirationTime - Date.now();
      console.log("login ")
      // 2. Only set timer if token is still valid
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          handleLogout();
        }, timeLeft);
        // 3. Cleanup timer if component unmounts
        return () => clearTimeout(timer);
      } else {
        handleLogout(); // Token already expired
      }
    } else {
      handleLogout();
    }

  }, [navigate]); // navigate is stable, so this only runs once on mount

  // Stable logout function for manual and auto use
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("theme");
    console.log('Logged out');
    navigate("/login");
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
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(classes.headerMenuButton, classes.headerMenuButtonCollapse)}
        >
          {(layoutState.isSidebarOpened) ? (
            <ArrowBackIcon sx={{ mx: "0 !important " }} classes={{ root: classNames(classes.headerIcon, classes.headerIconCollapse) }} />
          ) : (
            <MenuIcon classes={{ root: classNames(classes.headerIcon, classes.headerIconCollapse) }} />
          )}
        </IconButton><Avatar
          alt={currentUser?.name}
          src={logo}
          sx={{ width: 56, height: 56 }}
        >

        </Avatar>
        <Typography variant='h4' weight='medium' sx={{ mx: "0 !important " }} className={classes.logotype}>

          Sriphala Mitra
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LiveClock />
        </Box>
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
            sx={{ border: '1px solid white', borderRadius: 1 }}
            variant="square"
          >
            {currentUser?.firstName?.[0]}
          </Avatar>
        </IconButton>
        <Typography style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>

          <Typography
            weight='bold'
            sx={{ textTransform: 'uppercase' }}
            className={classes.profileLabel}
          >
            {userDetails?.userId}
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

          <MenuItem className={classNames(classes.profileMenuItem, classes.headerMenuItem)}>
            <AccountIcon className={classes.profileMenuIcon} />
            <Link to={`/app/user/${userDetails?.id}`} style={{ textDecoration: 'none' }}>Profile</Link>
          </MenuItem>
          <MenuItem className={classNames(classes.headerMenuItem)} style={{ textDecoration: 'none' }} onClick={handleLogout}>

            <PowerSettingsNewIcon className={classes.profileMenuIcon} />  Sign Out

          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
