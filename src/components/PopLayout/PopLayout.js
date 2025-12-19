import React from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function PopLayout({ open, onClose, children }) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { p: 0, m: 0, position: 'relative', width: '100%' } }}
      >
        <div style={{ padding: '10px 0' }}>
          <IconButton
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8, p: 0, zIndex: 1 }}
            aria-label="close dialog"
            onClick={onClose}
            color="secondary"
          >
            <HighlightOffIcon />
          </IconButton>
          {children}
        </div>
      </Dialog>
    </React.Fragment>
  );
}