import React, { useState, useEffect, useMemo } from 'react';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Drawer, IconButton, List, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

// styles
import useStyles from './styles';
// components
import SidebarLink from './components/SidebarLink/SidebarLink';

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from '../../context/LayoutContext';

function Sidebar({ structure }) {
  let classes = useStyles();
  let theme = useTheme();
  const location = useLocation();

  // global
  let { isSidebarOpened } = useLayoutState();
  let layoutDispatch = useLayoutDispatch();

  // --- RESTORE THIS LINE ---
  const [isPermanent, setPermanent] = useState(true);

  const toggleDrawer = (value) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    if (value && !isPermanent) toggleSidebar(layoutDispatch);
  };

  const isSidebarOpenedWrapper = useMemo(
    () => (!isPermanent ? !isSidebarOpened : isSidebarOpened),
    [isPermanent, isSidebarOpened],
  );

  // --- RESTORE WINDOW RESIZE LOGIC ---
  useEffect(function () {
    const handleWindowWidthChange = () => {
      let windowWidth = window.innerWidth;
      let breakpointWidth = theme.breakpoints.values.md;
      let isSmallScreen = windowWidth < breakpointWidth;

      if (isSmallScreen && isPermanent) {
        setPermanent(false);
      } else if (!isSmallScreen && !isPermanent) {
        setPermanent(true);
      }
    };

    window.addEventListener('resize', handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener('resize', handleWindowWidthChange);
    };
  }, [isPermanent, theme.breakpoints.values.md]);

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
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List
        className={classes.sidebarList}
        classes={{ padding: classes.padding }}
      >
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            // isPermanent is now defined and accessible here
            isSidebarOpened={!isPermanent ? !isSidebarOpened : isSidebarOpened}
            {...link}
            toggleDrawer={toggleDrawer(true)}
          />
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
