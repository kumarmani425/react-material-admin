import React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import DynamicList from '../../../components/DynamicList/DynamicList';
import { Phone } from '@mui/icons-material';
import { fi } from 'date-fns/locale';



export default function OrderList() {
    const columns = [
        { field: 'sno', headerName: 'S.No', flex: 0.5, minWidth: 50 },
        { field: 'id', headerName: 'Order Id', flex: 1, minWidth: 80 },

        {
            field: 'bName',
            headerName: 'Buyer',
            flex: 1.5,
            minWidth: 150
        },
        { field: 'village', headerName: 'Village', flex: 1, minWidth: 120 },
        { field: 'totalAmount', headerName: 'Total Amount', flex: 1, minWidth: 120 },
        { field: 'order_date', headerName: 'Order Date', flex: 1, minWidth: 120 },

        { field: 'user', headerName: 'User', flex: 1, minWidth: 120 },
        { field: 'items', headerName: 'Items Length', flex: 1, minWidth: 150 },

    ];

    const transform = (item, index) => {
        return {
            id: item?.id,
            sno: index + 1,
            bName: item.buyer.person.name || 'N/A',
            user: item.user.userId,

            village: item.buyer.person.village || 'N/A',
            order_date: item.order_date,
            totalAmount: item.totalAmount,
            items: item.items.length

        };
    };


    return <DynamicList apiPath='orders/getAllOrders' isTrader={false} title="Order" columns={columns} transform={transform} />;
}
