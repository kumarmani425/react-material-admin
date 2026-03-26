import React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import DynamicList from '../../../components/DynamicList/DynamicList';
import { Phone } from '@mui/icons-material';
import { fi } from 'date-fns/locale';



export default function TradersList() {
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



        const totalAmount = item?.traderPurchase?.reduce((acc, purchase) => {
            if (purchase?.status === "P") {

                acc += Number(purchase?.total_amount) || 0;
            } else if (purchase?.status === 'PP') {

                acc += Number(purchase?.balance) || 0;
            }
            return acc;
        }, 0) || 0;

        const totalsQuantity = item?.stock?.reduce((acc, stc) => {
            if (stc?.status === "P") {
                acc += Number(stc?.quantity) || 0;
            } else if (stc?.status === 'PP') {
                acc += Number(stc?.balance) || 0;
            }
            return acc;
        }, 0) || 0;

        // Rounding the final results safely
        const quantity = Math.round(totalsQuantity);



        return {
            id: item?.id,
            aadhar: item?.person.aadhar,
            sno: index + 1,
            forumId: item?.person.forum_id,
            name: item.person.name || 'N/A',
            phone: phoneNo,
            village: item.person.village || 'N/A',
            quantity: quantity,
            totalAmount: Math.round(totalAmount),

        };
    };

    return <DynamicList apiPath='trader/allTraders' isTrader={true} title="trader" columns={columns} transform={transform} />;
}
