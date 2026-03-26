import React, { useEffect, useState } from 'react';
import {
    Button, Dialog, DialogTitle, DialogContent,
    DialogActions, Typography, Grid, Divider, Box
} from '@mui/material';
import Fieldset from '../../Fieldset/Fieldset';

const OrderItemDetails = ({ items }) => {
    const [orderItems, setOrderItems] = useState([])
    const grandTotal = items?.length > 0 && items.reduce((sum, item) => sum + (Number(item.total_price) || 0), 0)
    useEffect(() => {
        console.log("ItemDetails", items)
        setOrderItems(items)
    }, [items])

    return (
        <div>
            {orderItems.length > 0 && orderItems.map((item) => (
                <Box key={item.id} sx={{ mb: 0 }}>
                    <Fieldset border={item.order_type === 'loose' ? 'C' : item.order_type === 'bharti' ? 'P' : null} title={item.name?.toUpperCase()}>
                        <Grid justifyContent="center"
                            alignItems="center" container spacing={2}>
                            <Grid item xs={2}>
                                <Typography variant="caption" color="textSecondary">Type</Typography>
                                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{item.order_type}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="textSecondary">Quantity / Builty Cut</Typography>
                                <Typography variant="body1">{item.quantity} / {item.builty_cut}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="caption" color="textSecondary">Unit Price</Typography>
                                <Typography variant="body1">₹{item.unit_price}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="textSecondary">Bharti / Bags</Typography>
                                <Typography variant="body1">{item.bharti} / {(item.quantity / item.bharti).toFixed(0)}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="caption" color="textSecondary">Status</Typography>
                                <Typography variant="body1" color={item.status === 'C' ? 'success.main' : 'error'}>
                                    {item.status === 'C' ? 'Completed' : 'Pending'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />

                                <Typography variant="h6" align="right" sx={{ mt: 1 }}>
                                    Total: ₹{parseFloat(item.total_price).toLocaleString()}
                                </Typography>

                            </Grid>
                        </Grid>
                    </Fieldset>
                    <br />
                </Box>
            ))}

            <Grid container sx={{ pa: 0, }} justifyContent="center"
                alignItems="center" spacing={12}>
                <Grid item sx={{ textAlign: 'center' }} xs={6}>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                        Order Id: {parseFloat(items[0]?.order_id).toLocaleString()}
                    </Typography>

                </Grid>
                <Grid item sx={{ textAlign: 'center' }} xs={6}>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                        Grand Total: ₹{parseFloat(grandTotal).toLocaleString()}
                    </Typography>

                </Grid>
            </Grid>
        </div>
    );
};

export default OrderItemDetails;