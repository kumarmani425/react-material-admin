import React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import DynamicList from '../../components/DynamicList/DynamicList';

export default function UsersList() {
  const columns = [
    { field: 'sno', headerName: 'S.No', flex: 0.5, minWidth: 50 },
    { field: 'userId', headerName: 'User Id', flex: 1, minWidth: 80 },

    {
      field: 'name',
      headerName: 'User Name',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <MuiLink component={Link} to={`/app/userPage/${params.row.id}`} underline="hover">
          {params.value}
        </MuiLink>
      ),
    },
    { field: 'village', headerName: 'Village', flex: 1, minWidth: 120 },
    { field: 'pendingTransactions', headerName: 'Pending Transactions', flex: 1, minWidth: 150 },
    { field: 'interesetAmount', headerName: 'Interest Amount', flex: 1, minWidth: 150 },
  ];

  const transform = (item, index) => {
    console.log(item)
    const village =
      item.person?.addresses?.find((add) => add.id === item.person?.dAddressId)?.village?.villageName ||
      'N/A';

    return {
      id: item?.id,
      userId: item?.userId,
      sno: index + 1,
      name: item.person?.sName ? `${item.person.sName} ${item.person.name || ''}`.trim() : item.person?.name || item.name || 'N/A',
      village,
      pendingTransactions: 0,
      interesetAmount: 0,
    };
  };


  return <DynamicList apiPath="users" title="User List" columns={columns} transform={transform} />;
}
