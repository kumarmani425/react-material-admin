import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getApiCallWithParams } from '../../nest_api';
import OrderItemDetails from '../../components/OrderForm/OrderDetailsModal/ItemDetils';
import { Card, CardContent } from '@mui/material';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { forumId, id } = useParams();

    console.log('orderId', id)
    const loadOrderDetils = async () => {
        setLoading(true);
        try {
            const orderListRes = await getApiCallWithParams(`orders/getOrderById/${id}`)
            console.log('getOrderById', orderListRes)
            const orderListWithName = orderListRes.items.map((item) => ({ ...item, name: item.category.c_name }))
            orderListRes.items = orderListWithName

            setOrders(orderListRes)

        } catch (err) {
            console.log("order page", err)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadOrderDetils()
    }, []);



    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="order-page">
            <Card sx={{ px: 2 }}>

                <h1>Orders _ {orders.id}</h1>
                <CardContent>
                    <OrderItemDetails items={orders.items ? orders.items : []} />
                </CardContent>
            </Card>

        </div>
    );
};

export default OrderPage;