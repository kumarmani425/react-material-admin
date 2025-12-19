import React, { useEffect, useState } from 'react';
import useStyles from './styles';
// 1. Change withRouter to useNavigate
import { useNavigate } from 'react-router-dom'; 

// Material-UI core components
import { AppBar, Toolbar, IconButton, Box, Button, useTheme } from '@mui/material';

// ... other imports remain the same (Icons, Components, Context)

const Header = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate(); // 2. Initialize the hook
  
  let layoutState = useLayoutState();
  let layoutDispatch = useLayoutDispatch();
  const [isSmall, setSmall] = useState(false);

  // ... (useEffect and handleWindowWidthChange remain the same)

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {/* ... Sidebar toggle icon code ... */}
        
        <Typography variant='h6' block className={classes.logo}>
         Sriphala Mitra <Typography variant={'h5'}>&nbsp; Documentation</Typography>
        </Typography>

        <Box display={'flex'} alignItems={'center'} className={classes.fullWidthXs}>
          {/* ... Social Media Icons ... */}
          
          <Box className={classes.headerButtons}>
            <Button
              color={'inherit'}
              style={{ marginRight: 16 }}
              // 3. Replace props.history.push with navigate
              onClick={() => navigate('/app')} 
            >
              Live Preview
            </Button>
            <Button
              href={'https://flatlogic.com/templates/react-material-admin-full'}
              variant='outlined'
              color='secondary'
            >
              Buy
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// 4. Export without withRouter
export default Header; 
