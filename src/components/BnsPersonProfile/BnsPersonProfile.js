import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Divider,
    List,
    ListItem,
    ListItemText,
    Chip,
    Grid
} from '@mui/material';
import { Person, Phone, AccountBalanceWallet, Home } from '@mui/icons-material';

export const BnsPersonProfile = ({ userData }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Helper for Tab Panels
    const TabPanel = ({ children, value, index }) => (
        <div role="tabpanel" hidden={value !== index} style={{ padding: '20px 0' }}>
            {value === index && <Box>{children}</Box>}
        </div>
    );

    return (
        <Card sx={{ px: 5, margin: '20px auto', boxShadow: 3 }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1 }}>
                <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
                    {userData.name}
                </Typography>
                <Typography variant="subtitle2">ID: {userData.id} | {userData.email}</Typography>
            </Box>

            <Tabs
                value={tabValue}
                onChange={handleChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab icon={<Person />} label="Basic Info" />
                <Tab icon={<Phone />} label="Contacts" />
                <Tab icon={<AccountBalanceWallet />} label="Payments" />

            </Tabs>

            <CardContent >
                {/* Tab 1: Basic Information */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography color="textSecondary" variant="caption">Father's Name</Typography>
                            <Typography variant="body1">{userData.fName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="textSecondary" variant="caption">Village</Typography>
                            <Typography variant="body1">{userData.village}</Typography>
                        </Grid>
                        {userData?.aadhar && <Grid item xs={12}>
                            <Typography color="textSecondary" variant="caption">Aadhar Number</Typography>
                            <Typography variant="body1">XXXX-XXXX-{userData?.aadhar?.slice(-4)}</Typography>
                        </Grid>}
                    </Grid>
                </TabPanel>

                {/* Tab 2: Phone Details */}
                <TabPanel value={tabValue} index={1}>
                    <List dense>
                        {userData.phones.map((phone) => (
                            <ListItem key={phone.id} divider>
                                <ListItemText
                                    primary={phone.number}
                                    secondary={phone.type.toUpperCase()}
                                />
                                {phone.isPrimary && <Chip label="Primary" color="success" size="small" />}
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>

                {/* Tab 3: UPI & Banking */}
                <TabPanel value={tabValue} index={2}>
                    {userData.UpiDetails.length > 0 ? (
                        userData.UpiDetails.map((upi) => (
                            <Box key={upi.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="primary">{upi.upi_type}</Typography>
                                <Typography variant="h6">{upi.upi_number}</Typography>
                                <Typography variant="caption">Name on Account: {upi.name}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography>No UPI details found.</Typography>
                    )}
                </TabPanel>

            </CardContent>
        </Card>
    );
};