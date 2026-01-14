import React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import DynamicList from '../../components/DynamicList/DynamicList';
import { PendingRounded } from '@mui/icons-material';
import { getDaysBetweenDates, interestCalculation } from "../../utils/utils";
import MovingIcon from '@mui/icons-material/Moving';
export default function DipositorList() {
  const columns = [
    { field: 'sno', headerName: 'S.No', flex: 0.5, minWidth: 50 },
    { field: 'id', headerName: 'Dep Id', flex: 1, minWidth: 80 },
    {
      field: 'name',
      headerName: 'Dep Name',
      flex: 1.5,
      minWidth: 150,

    },
    { field: 'village', headerName: 'Village', flex: 1, minWidth: 120 },
    {
      field: 'pendingTransactions', headerName: 'Amount', flex: 1, minWidth: 150, renderCell: (params) => {
        const { pndTnxType } = params.row
        if (pndTnxType === 'credit') {
          return <><>{params.value}</> {pndTnxType && <MovingIcon sx={{ transform: 'rotate(180deg)', color: 'success.main' }} />} </>;
        }
        return <><>{params.value}</> {pndTnxType && <MovingIcon sx={{ color: 'error.main' }} />}</>;
      }
    },
    { field: 'interesetAmount', headerName: 'Interest', flex: 1, minWidth: 150 },
  ];

  const transform = (item, index) => {

    const pendingRecored = item.paymentDetails.find((item, index) => item.status === "P");
    const amount = pendingRecored ? (pendingRecored.amount * pendingRecored.inst_rate * 1) / 100 : 0
    const interest = pendingRecored ? Math.round((amount / 365) * getDaysBetweenDates(pendingRecored.createdAt, new Date())) : 0

    const village =
      item.person?.addresses?.find((add) => add.id === item.person?.dAddressId)?.village?.villageName ||
      'N/A';

    return {
      id: item?.dep_id,
      sno: index + 1,
      forumId: item?.forum_id,
      name: item.person?.sName ? `${item.person.sName} ${item.person.name || ''}`.trim() : item.person?.name || item.name || 'N/A',
      pndTnxType: pendingRecored && pendingRecored.type,
      village: village,
      pendingTransactions: pendingRecored ? pendingRecored.amount : 0,
      interesetAmount: interest,
    };
  };

  return <DynamicList apiPath="depositor/list" title="dipositor" columns={columns} transform={transform} />;
}
