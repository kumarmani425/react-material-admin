import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Stack, Chip } from '@mui/material';

// 1. Define your Status Configuration here
const STATUS_CONFIG = {
    PP: { color: '#ff9800', label: 'Pending', bgColor: '#fff3e0' },
    C: { color: '#2e7d32', label: 'Open', bgColor: '#e8f5e9' },
    P: { color: '#d21919', label: 'Closed', bgColor: '#e3f2fd' },
    DEFAULT: { color: '#9e9e9e', label: 'Unknown', bgColor: '#f5f5f5' }
};

const ItemTemplate = ({ item }) => {
    // Fallback to DEFAULT if status code isn't in config
    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.DEFAULT;

    console.log("ItemTemplate item", item);

    return (
        <Card
            sx={{
                borderLeft: `8px solid ${config.color}`,
                borderTop: `1px solid ${config.color}`,
                borderRight: `1px solid ${config.color}`,
                borderBottom: `1px solid ${config.color}`,
                borderRadius: '8px',
                transition: '0.3s',
                '&:hover': { boxShadow: 6 }
            }}
        >
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ width: '100%' }}>
                    <Box sx={{ flex: 1, width: '100%' }}>
                        <Grid container spacing={4} alignItems="center" justifyContent="stretch" sx={{ width: '100%' }}>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" textTransform={'uppercase'} ><b><Chip label={item.cDetails?.c_name} color="primary" variant="outlined" />  </b> </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2">Qty: <b>{item.quantity}</b> @ {item.unit_price}</Typography>

                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h6">{item.total_amount}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                    Date: {new Date(item.t_date).toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                    User: {item.user?.userId || 'Unknown'}
                                </Typography>
                            </Grid>
                            {item.status !== 'O' && (
                                <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6">
                                        Blance: {item.balance}
                                    </Typography>
                                </Grid>)}
                        </Grid>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        ID: {item.id}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default function DynamicStatusGrid({ transactions }) {
    console.log("DynamicStatusGrid transactions", transactions);
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {transactions?.map((t) => (
                    <Grid item xs={12} sm={6} md={12} key={t.id}>
                        <ItemTemplate item={t} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
