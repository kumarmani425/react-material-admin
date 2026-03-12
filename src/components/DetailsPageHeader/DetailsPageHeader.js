import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import { useParams, Link } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { AccountCircle, Assessment, Percent, AccountBalanceWallet } from '@mui/icons-material';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
const renderListItem = (label, value) => (
  <ListItem key={label} sx={{ justifyContent: "center", p: 0 }}>
    <ListItemText primary={label} sx={{ textAlign: "right", flex: 1 }} />
    &nbsp;&nbsp;&nbsp;&nbsp;
    {label === 'Created By' ? <ListItemText primary={value} style={{ color: "green !important" }} sx={{ textAlign: "left", flex: 1 }} /> : <ListItemText primary={value} sx={{ textAlign: "left", flex: 1 }} />}
  </ListItem>
);

const DetailsPageHeader = ({ icon: Icon, personDetails, headerDetails, option = false, isTrader = false, pandingRecord, pageTitle }) => {
  console.log("pendingRecord", personDetails?.person?.id)
  console.log("details pendingRecord", pandingRecord)
  let [searchParams, setSearchParams] = useSearchParams();
  const { type, id } = useParams();



  const ITEM_HEIGHT = 48;


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Card sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2 }}>
      <AppBar position="static" sx={{ textTransform: "capitalize", borderRadius: '8px 8px 0 0' }}>
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            {Icon ? <Icon fontSize="large" sx={{ color: 'white', }} /> : <AccountCircle fontSize="large" sx={{ color: 'white', }} />}  {pageTitle || 'Seller'} Page
          </Typography>
          {option && (
            <div>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon sx={{ color: 'white' }} />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { maxHeight: 40 * 4.5, width: '20ch' } }}
              >
                <MenuItem
                  component={Link}
                  to={`/app/userEdit?personId=${personDetails?.person?.id}&id=${id}&type=${pageTitle}&isEdit=true`}
                  onClick={handleClose}
                >
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Edit
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <CardContent sx={{ textTransform: "capitalize", p: 4 }}>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {/* Left Section: Details */}
          <Grid item xs={12} md={pandingRecord ? 5.5 : 12}>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <Assessment color="primary" /> <u>{pageTitle || 'Seller'} Details</u>
            </Typography>
            <List>
              {headerDetails.map((item, index) => (
                <React.Fragment key={index}>
                  {renderListItem(item.label + " :", item.value)}
                </React.Fragment>
              ))}
            </List>
          </Grid>

          {/* Vertical Divider */}
          {pandingRecord && (
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }} />
          )}

          {/* Right Section: Account Status */}
          {pandingRecord && (
            <Grid item xs={12} md={5.5} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWallet color="primary" /> <u>Account Status</u>
              </Typography>

              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                {!isTrader && <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', justifyContent: 'center' }}>
                    <CurrencyRupeeOutlinedIcon fontSize="small" color="action" />
                    <Typography variant="body1">
                      <strong>Amount:</strong> {pandingRecord?.amount || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', justifyContent: 'center' }}>
                    <Percent fontSize="small" color="action" />
                    <Typography variant="body1">
                      <strong>Interest:</strong> {pandingRecord?.interestAmount || 0}
                    </Typography>
                  </Box>

                  <Divider sx={{ width: '80%', my: 1 }} />
                </>}

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="text.secondary" display="block"><CurrencyRupeeOutlinedIcon fontSize="small" color="action" /> TOTAL PENDING</Typography>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                    {pandingRecord?.totalPendingAmount || 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>


  );
};

export default DetailsPageHeader;
