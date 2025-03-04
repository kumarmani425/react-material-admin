import React, { useState, useEffect, useMemo } from 'react';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Drawer, IconButton, List } from '@mui/material';
import { useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom'; // useLocation hook replaces withRouter
import classNames from 'classnames';

// styles
import useStyles from './styles';
// components
import SidebarLink from './components/SidebarLink/SidebarLink';
// context
import { useLayoutState, useLayoutDispatch, toggleSidebar } from '../../context/LayoutContext';

function Sidebar({ structure }) {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation(); // get router location using hook
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  // local state: whether the drawer is permanent or temporary
  const [isPermanent, setPermanent] = useState(true);

  // Callback to toggle the drawer
  const toggleDrawer = (value) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    // Only toggle sidebar if temporary (non-permanent)
    if (value && !isPermanent) {
      toggleSidebar(layoutDispatch);
    }
  };

  // Compute the sidebar open state based on permanent flag and global state
  const isSidebarOpenedWrapper = useMemo(
    () => (!isPermanent ? !layoutState.isSidebarOpened : layoutState.isSidebarOpened),
    [isPermanent, layoutState.isSidebarOpened]
  );

  useEffect(() => {
    window.addEventListener('resize', handleWindowWidthChange);
    handleWindowWidthChange();
    return () => {
      window.removeEventListener('resize', handleWindowWidthChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.breakpoints.values.md, isPermanent]);

  // Automatically adjust sidebar mode based on window width
  function handleWindowWidthChange() {
    const windowWidth = window.innerWidth;
    const breakpointWidth = theme.breakpoints.values.md;
    const isSmallScreen = windowWidth < breakpointWidth;
    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }

  return (
    <Drawer
      variant={isPermanent ? 'permanent' : 'temporary'}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpenedWrapper,
        [classes.drawerClose]: !isSidebarOpenedWrapper,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpenedWrapper,
          [classes.drawerClose]: !isSidebarOpenedWrapper,
        }),
      }}
      open={isSidebarOpenedWrapper}
      onClose={toggleDrawer(true)}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{ root: classNames(classes.headerIcon, classes.headerIconCollapse) }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList} classes={{ padding: classes.padding }}>
        {structure.map((link) => (
          <SidebarLink
            key={link.id}
            location={location} // pass in location for active link highlighting, etc.
            isSidebarOpened={!isPermanent ? !layoutState.isSidebarOpened : layoutState.isSidebarOpened}
            {...link}
            toggleDrawer={toggleDrawer(true)}
          />
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;