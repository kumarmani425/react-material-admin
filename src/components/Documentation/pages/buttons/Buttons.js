import React from 'react';
import { Box, Grid } from '@mui/material';
// 1. Removed: import { withRouter } from 'react-router-dom';

//components
import Widget from '../../../Widget';
import { Typography, Button } from '../../../Wrappers';
import Code from '../../../Code';

const Pages = (props) => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Widget disableWidgetMenu>
            <Typography
              variant={'h4'}
              style={{
                marginBottom: 15,
                marginTop: 10,
                color: 'rgb(110, 110, 110)',
              }}
            >
              Buttons
            </Typography>
            {/* ... rest of your JSX remains exactly the same ... */}
            <Box display={'flex'} flexWrap='wrap'>
               {/* Button examples */}
            </Box>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
};

// 2. Updated export to a standard export
export default Pages; 
