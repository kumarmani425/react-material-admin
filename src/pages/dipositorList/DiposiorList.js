import React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import DynamicList from '../../components/DynamicList/DynamicList';

export default function DipositorList() {
  const columns = [
    { field: 'sno', headerName: 'S.No', flex: 0.5, minWidth: 50 },
    { field: 'id', headerName: 'dep_id', flex: 1, minWidth: 80 },
    {
      field: 'name',
      headerName: 'Dep Name',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <MuiLink component={Link} to={`/app/dipositorPage/${params.row.id}`} underline="hover">
          {params.value}
        </MuiLink>
      ),
    },
    { field: 'village', headerName: 'Village', flex: 1, minWidth: 120 },
    { field: 'pendingTransactions', headerName: 'Pending Transactions', flex: 1, minWidth: 150 },
    { field: 'interesetAmount', headerName: 'Interest Amount', flex: 1, minWidth: 150 },
  ];

  const transform = (item, index) => {
    const village =
      item.person?.addresses?.find((add) => add.id === item.person?.dAddressId)?.village?.villageName ||
      'N/A';

    return {
      id: item?.dep_id,
      sno: index + 1,
      name: item.person?.sName ? `${item.person.sName} ${item.person.name || ''}`.trim() : item.person?.name || item.name || 'N/A',
      village,
      pendingTransactions: 0,
      interesetAmount: 0,
    };
  };

  return <DynamicList apiPath="depositor/list" title="Dipositor List" columns={columns} transform={transform} />;
}
