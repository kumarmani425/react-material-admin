import React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import DynamicList from '../../../components/DynamicList/DynamicList';
import { Phone } from '@mui/icons-material';
import { fi } from 'date-fns/locale';



export default function BuyersList() {
    const columns = [
        { field: 'sno', headerName: 'S.No', flex: 0.5, minWidth: 50 },
        { field: 'aadhar', headerName: 'Aadhar Id', flex: 1, minWidth: 80 },

        {
            field: 'name',
            headerName: 'Name',
            flex: 1.5,
            minWidth: 150
        },
        { field: 'village', headerName: 'Village', flex: 1, minWidth: 120 },
        { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 120 },
        { field: 'quantity', headerName: 'Pending Stock', flex: 1, minWidth: 150 },
        { field: 'totalAmount', headerName: 'Pending Amount', flex: 1, minWidth: 150 },
    ];

    const transform = (item, index) => {

        const phoneNo = item?.person.phones.find(phone => {
            return item.person.dPhone_id === phone.id;
        })?.number || 'N/A';



        const totals = item?.traderPurchase?.reduce((acc, purchase) => {
            if (purchase?.status === "P") {
                // Use Number() to ensure it's a numeric type, then || 0 to catch NaN/null/undefined
                acc.quantity += Number(purchase?.quantity) || 0;
                acc.totalAmount += Number(purchase?.total_amount) || 0;
            }
            return acc;
        }, { quantity: 0, totalAmount: 0 }) || { quantity: 0, totalAmount: 0 }; // Fallback for the whole object

        // Rounding the final results safely
        const quantity = Math.round(totals.quantity);
        const totalAmount = Math.round(totals.totalAmount);


        return {
            id: item?.p_id,
            aadhar: item?.person.aadhar,
            sno: index + 1,
            forumId: item?.person.forum_id,
            name: item.person.name || 'N/A',
            phone: phoneNo,
            village: item.person.village || 'N/A',
            quantity: quantity,
            totalAmount: totalAmount,

        };
    };
    console.log('columns', transform)

    return <DynamicList apiPath='buyer/allBuyers' isTrader={false} title="buyer" columns={columns} transform={transform} />;
}
