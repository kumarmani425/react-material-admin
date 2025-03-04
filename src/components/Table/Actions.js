import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate replaces useHistory
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Actions = ({ classes, id, openModal, entity }) => {
  const navigate = useNavigate(); // retrieve navigate function
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Handle click on the IconButton to open the menu
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div id={id} key={id}>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        classes={classes}
      >
        <MenuItem
          classes={classes}
          onClick={() => {
            navigate(`/admin/${entity}/${id}/edit`);
            handleClose();
          }}
        >
          <EditIcon /> Edit
        </MenuItem>
        <MenuItem
          classes={classes}
          onClick={(event) => {
            openModal(event, id);
            handleClose();
          }}
        >
          <DeleteIcon /> Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Actions;