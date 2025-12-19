import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PopLayout from '../PopLayout/PopLayout';
import CreateVillage from '../../pages/createVillage/CreateVillage';
const CheateVillagePop = ({ open, onClose, onCreate }) => {
    const [villageName, setVillageName] = React.useState('');

    const handleCreate = () => {
        if (villageName.trim()) {
            onCreate(villageName);
            setVillageName('');
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <PopLayout  open={open} onClose={handleClose}>
            
                <CreateVillage ></CreateVillage>
            
            
        </PopLayout>
    );
};

export default CheateVillagePop;