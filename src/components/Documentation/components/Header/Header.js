import React, { useEffect, useState } from 'react';
import useStyles from './styles';
import { AppBar, Toolbar, IconButton, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material';
// Material Icons
import { ArrowBack as ArrowBackIcon, Menu as MenuIcon } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
// Components
import { Typography, Link } from '../../../Wrappers';
import { toggleSidebar, useLayoutDispatch, useLayoutState } from '../../../../context/LayoutContext';
import classNames from 'classnames';
// Import the useNavigate hook from react-router-dom for programmatic navigation
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const theme = useTheme();
  const classes = useStyles();
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutDispatch();
  const [isSmall, setSmall] = useState(false);

  // Create navigate function for programmatic navigation
  const navigate = useNavigate();

  useEffect(() => {
    // Add event listener to handle window resize
    window.addEventListener('resize', handleWindowWidthChange);
    // Call the resize handler initially
    handleWindowWidthChange();
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleWindowWidthChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.breakpoints.values.md]);

  // Function to update state based on window width
  function handleWindowWidthChange() {
    const windowWidth = window.innerWidth;
    const breakpointWidth = theme.breakpoints.values.md;
    const isSmallScreen = windowWidth < breakpointWidth;
    setSmall(isSmallScreen);
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {/* Icon button to toggle the sidebar */}
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(classes.headerMenuButton, classes.headerMenuButtonCollapse)}
        >
          {(!layoutState.isSidebarOpened && isSmall) || (layoutState.isSidebarOpened && !isSmall) ? (
            <ArrowBackIcon classes={{ root: classNames(classes.headerIcon, classes.headerIconCollapse) }} />
          ) : (
            <MenuIcon classes={{ root: classNames(classes.headerIcon, classes.headerIconCollapse) }} />
          )}
        </IconButton>

        {/* Logo text */}
        <Typography variant="h6" block className={classes.logo}>
          React Material Admin Full{' '}
          <Typography variant="h5">&nbsp; Documentation</Typography>
        </Typography>

        <Box display="flex" alignItems="center" className={classes.fullWidthXs}>
          {/* Social media icons */}
          <Box display="flex" className={classes.icons}>
            <Link href="https://twitter.com/flatlogic">
              <IconButton>
                <TwitterIcon style={{ color: '#fff' }} />
              </IconButton>
            </Link>
            <Link href="https://www.facebook.com/flatlogic">
              <IconButton>
                <FacebookIcon style={{ color: '#fff' }} />
              </IconButton>
            </Link>
            <Link href="https://instagram.com/flatlogiccom/">
              <IconButton>
                <InstagramIcon style={{ color: '#fff' }} />
              </IconButton>
            </Link>
            <Link href="https://www.linkedin.com/company/flatlogic/">
              <IconButton>
                <LinkedInIcon style={{ color: '#fff' }} />
              </IconButton>
            </Link>
            <Link href="https://github.com/flatlogic">
              <IconButton>
                <GitHubIcon style={{ color: '#fff' }} />
              </IconButton>
            </Link>
          </Box>

          {/* Navigation buttons */}
          <Box className={classes.headerButtons}>
            {/* The "Live Preview" button now uses useNavigate for navigation */}
            <Button
              color="inherit"
              style={{ marginRight: 16 }}
              onClick={() => navigate('/app')}
            >
              Live Preview
            </Button>
            <Button
              href="https://flatlogic.com/templates/react-material-admin-full"
              variant="outlined"
              color="secondary"
            >
              Buy
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;