import React, { useEffect, useRef, useState } from 'react';
import { Popover, Alert } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
export default function AutoSuccessPopover({openAlert}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    console.log('openAlert', openAlert)
    // Automatically trigger on mount
    setAnchorEl(openAlert);

    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      setAnchorEl(null);
    }, 300000000);

    return () => clearTimeout(timer);
  }, [openAlert]);

  const open = !!anchorEl;
  const id = open ? 'success-popover' : undefined;

  return (
    <div style={{ position: 'absolute',top: '30%', right: 0,padding: 0,margin: 0 }}>
      {/* This invisible element serves as the anchor */}
      <div ref={triggerRef} style={{ display: 'inline-block' }}></div>

      <Popover sx={{minWidth: '500px'}}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'left',
          horizontal: 'left',
        }}
      >
        <Alert severity={openAlert?.type} variant="filled" sx={{ minWidth :"300px", width: '100%' }}>
        <AlertTitle>{openAlert?.type}</AlertTitle>
          {openAlert?.message}
        </Alert>
      </Popover>
    </div>
  );
}
