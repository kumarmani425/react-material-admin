import React,{useEffect} from 'react';
import {
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Typography,
  Grid,
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

import IconButton from '@mui/material/IconButton';
import { is } from 'date-fns/locale';
const renderListItem = (label, value) => (
    <ListItem key = {label} sx={{ justifyContent: "center", p: 0 }}>
      <ListItemText primary={label} sx={{ textAlign: "right", flex: 1 }} /> 
      &nbsp;&nbsp;&nbsp;&nbsp;
      {label === 'Created By' ?<ListItemText primary={value} style={{ color: "green !important" }} sx={{ textAlign: "left", flex: 1}} />:<ListItemText primary={value} sx={{ textAlign: "left", flex: 1 }} /> } 
    </ListItem>
  );

const DetailsPageHeader = ({ headerDetails, pageName, pendingRecord,pageTitle }) => {
  console.log("pendingRecord", pendingRecord)
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
    <Card sx={{ minWidth: 275 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {pageTitle|| 'Seller'} Page
          </Typography>
         <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon sx={{color:'white'}} />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
          list: {
            'aria-labelledby': 'long-button',
          },
        }}
      >
        <MenuItem component={Link} to={`/app/userEdit?id=${id}&type=user&isEdit=true`}  onClick={handleClose} disableRipple>
          <EditIcon fontSize="small" />
          Edit
        </MenuItem>
        
      </Menu>
    </div>
        </Toolbar>
      </AppBar>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography variant="h4" align="center">
              {pageTitle || 'Seller'} Details
            </Typography>
            <List>
              {headerDetails.map((item, index) => (
                <React.Fragment key={index}>
                  {renderListItem(item.label + " :", item.value)}
                </React.Fragment>
              ))}
            </List>
          </Grid>          
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DetailsPageHeader;
