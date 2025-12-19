import React, { useEffect, useContext } from 'react';
// Replace Switch and withRouter with modern equivalents
import { Route, Routes, useNavigate } from 'react-router-dom'; 
import classnames from 'classnames';

import SettingsIcon from '@mui/icons-material/Settings';
import GithubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

import { Fab, IconButton } from '@mui/material';
import NotificationContext from '../../store/alert-context';

// styles
import useStyles from './styles';

// components
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link } from '../Wrappers';
import ColorChangeThemePopper from './components/ColorChangeThemePopper';

// pages
import Dashboard from '../../pages/dashboard';
import CreateSeller from '../../pages/createSeller/CreateSeller';
import DipositorList from '../../pages/dipositorList/DiposiorList';
import DipositorPage from '../../pages/dipositorPage/DipositorPage';
import Scroll from '../Scroll/Scroll';
import SellerList from '../../pages/sellerList/SellerList';
import SellerPage from '../../pages/sellerPage/SellerPage';
import CreateVillage from '../../pages/createVillage/CreateVillage';
import CreateState from '../../pages/createState/CreateState'; 
import CreateDistrict from '../../pages/createDistrict/CreateDistrict';
import PersonDetails from '../../pages/PersonDetails/PersonDetails';
import AutoSuccessPopover from '../../pages/alert/SuccessPopover';
import CreateMandal from '../../pages/createMandal/CreateMandal';
import PersonList from '../../pages/personList/PersonList';
import AadharSearch from '../AadarSearch/Aadar_search';
import UsersList from '../../pages/user/UserList';
import UserPage from '../../pages/user/Userpage';

// context
import { useLayoutState } from '../../context/LayoutContext';
import structure from '../Sidebar/SidebarStructure';

function Layout() {
  const alertCtx = useContext(NotificationContext);
  const classes = useStyles();
  const navigate = useNavigate(); // v6 Hook for navigation
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'add-section-popover' : undefined;
  
  const handleClick = (event) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  let layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      {/* Remove history prop; use useNavigate hook inside Header instead */}
      <Header navigate={navigate} /> 
      <Sidebar structure={structure} />
      <div className={classnames(classes.content, { [classes.contentShift]: layoutState.isSidebarOpened })}>
        <div className={classes.fakeToolbar} />
        <AutoSuccessPopover openAlert={alertCtx.notification} />
        
        {/* Replace <Switch> with <Routes> and use 'element' prop with JSX */}
        <Routes>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path="create/:type" element={<AadharSearch />} />
          <Route path="createSeller" element={<CreateSeller />} />
          <Route path="createPerson/:type/:aadhar" element={<CreateSeller />} />
          <Route path="dipositorList" element={<DipositorList />} />
          <Route path="sellerList" element={<SellerList />} />
          <Route path="personDetails" element={<PersonDetails />} />
          <Route path="dipositorPage/:id" element={<DipositorPage />} />
          <Route path="userPage/:id" element={<UserPage />} />
          <Route path="sellerPage/:id" element={<SellerPage />} />
          <Route path="scroll" element={<Scroll />} />
          <Route path="createVillage" element={<CreateVillage />} />
          <Route path="createState" element={<CreateState />} />
          <Route path="createDistrict" element={<CreateDistrict />} />
          <Route path="createMandal" element={<CreateMandal />} />
          <Route path="personList" element={<PersonList />} />
          <Route path="userList" element={<UsersList />} />
          <Route path=":type" element={<CreateSeller />} />
          <Route path="personPage/:id" element={<PersonDetails />} />
        </Routes>

        <Fab
          color='primary'
          aria-label='settings'
          onClick={(e) => handleClick(e)}
          className={classes.changeThemeFab}
          style={{ zIndex: 100 }}
        >
          <SettingsIcon style={{ color: '#fff' }} />
        </Fab>
        <ColorChangeThemePopper id={id} open={open} anchorEl={anchorEl} />
        
        <Footer>
          {/* Footer content remains the same */}
          <div>
            <Link color={'primary'} href={'flatlogic.com'} target={'_blank'} className={classes.link}>Flatlogic</Link>
            <Link color={'primary'} href={'flatlogic.comabout'} target={'_blank'} className={classes.link}>About Us</Link>
            <Link color={'primary'} href={'flatlogic.comblog'} target={'_blank'} className={classes.link}>Blog</Link>
          </div>
          <div>
            <Link href={'www.facebook.com'} target={'_blank'}><IconButton><FacebookIcon style={{ color: '#6E6E6E99' }} /></IconButton></Link>
            <Link href={'twitter.com'} target={'_blank'}><IconButton><TwitterIcon style={{ color: '#6E6E6E99' }} /></IconButton></Link>
            <Link href={'github.com'} target={'_blank'}><IconButton style={{ padding: '12px 0 12px 12px' }}><GithubIcon style={{ color: '#6E6E6E99' }} /></IconButton></Link>
          </div>
        </Footer>
      </div>
    </div>
  );
}

// Export directly as withRouter is deprecated
export default Layout;
