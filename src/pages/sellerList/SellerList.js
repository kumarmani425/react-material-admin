import React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import DynamicList from '../../components/DynamicList/DynamicList';
import { Phone } from '@mui/icons-material';
import { fi } from 'date-fns/locale';

export default function UsersList() {
  const columns = [
    { field: 'sno', headerName: 'S.No', flex: 0.5, minWidth: 50 },
    { field: 'aadhar', headerName: 'Aadhar Id', flex: 1, minWidth: 80 },

    {
      field: 'name',
      headerName: 'Name',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <MuiLink component={Link} to={`/app/user/${params.row.id}`} underline="hover">
          {params.value}
        </MuiLink>
      ),
    },
    { field: 'village', headerName: 'Village', flex: 1, minWidth: 120 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 120 },
    { field: 'pendingTransactions', headerName: 'Pending Transactions', flex: 1, minWidth: 150 },
    { field: 'interesetAmount', headerName: 'Interest Amount', flex: 1, minWidth: 150 },
  ];

  const transform = (item, index) => {
    console.log(item)

    const phoneNo = item?.phones.find(phone => item.id === phone.p_id && phone.isPrimary)?.number || 'N/A';

    return {
      id: item?.id,
      aadhar: item?.aadhar,
      sno: index + 1,
      forumId: item?.forum_id,
      name: item.name || 'N/A',
      phone: phoneNo,
      village: item.village || 'N/A',
      pendingTransactions: 0,
      interesetAmount: 0,
    };
  };


  return <DynamicList apiPath='bns-person/getAllBNSPerson' title="trader" columns={columns} transform={transform} />;
}
