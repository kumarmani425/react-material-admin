import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Typography,
    Stack, Box, Divider, Chip, Button, IconButton, Zoom,
    List, ListItem, ListItemText, ListItemSecondaryAction, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AllInOnePopModal = ({ payments }) => {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState('list'); // 'list' or 'detail'
    const [selected, setSelected] = useState(null);

    const handleOpen = () => { setView('list'); setOpen(true); };
    const handleClose = () => { setOpen(false); setSelected(null); };

    const showDetail = (item) => {
        setSelected(item);
        setView('detail');
    };

    return (
        <Box sx={{ p: 5, textAlign: 'center' }}>
            {/* MAIN TRIGGER */}
            <Button variant="contained" size="large" onClick={handleOpen} sx={{ borderRadius: 8 }}>
                Open Payment Records ({payments.length})
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Zoom}
                fullWidth
                maxWidth="xs"
                PaperProps={{ sx: { borderRadius: 4, height: '500px' } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {view === 'detail' && (
                        <IconButton onClick={() => setView('list')} size="small">
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" fontWeight="bold">
                        {view === 'list' ? 'All Payments' : `Details #${selected?.purchase_id}`}
                    </Typography>
                    <IconButton onClick={handleClose} sx={{ ml: 'auto' }}><CloseIcon /></IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ p: 0 }}>
                    {view === 'list' ? (
                        /* DYNAMIC ARRAY LIST */
                        <List>
                            {payments.map((item) => (
                                <ListItem
                                    key={item.id}
                                    divider
                                    button
                                    onClick={() => showDetail(item)}
                                    sx={{ '&:hover': { bgcolor: 'primary.50' } }}
                                >
                                    <ListItemText
                                        primary={`Purchase #${item.purchase_id}`}
                                        secondary={new Date(item.payment_date).toLocaleDateString()}
                                    />
                                    <Typography variant="body2" fontWeight="bold" color="primary">
                                        ₹{parseFloat(item.amount).toLocaleString()}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        /* DYNAMIC OBJECT DETAIL VIEW */
                        <Stack spacing={3} sx={{ p: 3 }}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }} elevation={0}>
                                <Typography variant="caption" color="textSecondary">TOTAL AMOUNT</Typography>
                                <Typography variant="h4" fontWeight="bold" color="success.main">
                                    ₹{parseFloat(selected.amount).toLocaleString()}
                                </Typography>
                                <Chip label="Pending" color="warning" size="small" sx={{ mt: 1 }} />
                            </Paper>

                            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                                <DataField label="User ID" value={selected.user_id} />
                                <DataField label="Mode" value={selected.payment_mode === "1" ? "Online" : "Cash"} />
                                <DataField label="Type" value={selected.payment_type} />
                                <DataField label="Date" value={new Date(selected.payment_date).toLocaleDateString()} />
                            </Box>

                            <Box sx={{ mt: 'auto', pt: 2 }}>
                                <Typography variant="caption" color="textDisabled">Created: {selected.createdAt}</Typography>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

const DataField = ({ label, value }) => (
    <Box>
        <Typography variant="caption" color="textSecondary">{label}</Typography>
        <Typography variant="body2" fontWeight="500">{value}</Typography>
    </Box>
);

export default AllInOnePopModal;
