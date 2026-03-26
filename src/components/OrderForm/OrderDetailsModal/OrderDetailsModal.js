import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Grid, Divider, Box
} from '@mui/material';
import Fieldset from '../../Fieldset/Fieldset';
import OrderItemDetails from './ItemDetils';

const OrderDetailsModal = ({ isOpen, closeModal, items }) => {
  const [open, setOpen] = useState(false);


  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])
  const grandTotal = items.reduce((sum, item) => sum + (Number(item.total_price) || 0), 0)
  const handleClose = () => {
    console.log("clsole");
    closeModal()
  };

  return (<>

    {items.length > 0 && <Box sx={{ p: 2 }}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 'bold' }}> Order Item Details</DialogTitle>
        <DialogContent dividers>
          <OrderItemDetails items={items} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>}
  </>
  );
};

export default OrderDetailsModal;
