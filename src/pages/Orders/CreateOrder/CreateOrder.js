import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, Box } from '@mui/material';
import OrderForm from '../../../components/OrderForm/OrderForm';

export default function CreateOrder() {
    const [order, setOrder] = useState({ product: '', quantity: 1, address: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Order Submitted:', order);
    };

    return (
        < >
            <OrderForm />
        </>
    );
}
