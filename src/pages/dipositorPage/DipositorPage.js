import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Card, CardContent, Button } from "@mui/material";
import AddDepAmount from "../../components/AddDepAmount/AddDepAmount";
import DepPayment from "../../components/DepPayment/DepPayment";
import { getDaysBetweenDates, interestCalculation } from "../../utils/utils";
import { depTransactions, getUser } from "../../api";
import { getApiCallWithParams } from "../../nest_api";
import dayjs from "dayjs";
import MovingIcon from '@mui/icons-material/Moving';

import DataGridComponent from "../../components/DataGrid/DataGridComponent";
import DetailsPageHeader from "../../components/DetailsPageHeader/DetailsPageHeader";

const DipositorPage = () => {
  const { forumId, id } = useParams();
  const navigate = useNavigate()

  console.log("DipositorPage id", useParams());
  const location = useLocation();
  const type = location.pathname.includes('/dipositor/') ? 'dipositor' : 'user';
  const [dipositor, setDipositor] = useState({});
  const [addAmount, setAddAmount] = useState(false);
  const [depPayment, setDepPayment] = useState(false);
  const [resposneData, setResponseData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [pandingRecord, setPaddingRecord] = useState({});
  const [headerDetails, setHeaderDetails] = useState([]);

  const columns = [
    { field: "sno", headerName: "S.No", flex: 0.3, minWidth: 60 },
    {
      field: "type", headerName: "Type", flex: 0.3, minWidth: 60, renderCell: (params) => {
        if (params.value === 'credit') {
          return <MovingIcon sx={{ transform: 'rotate(180deg)', color: 'success.main' }} />;
        }
        return <MovingIcon sx={{ color: 'error.main' }} />;
      }
    },
    { field: "createdDate", headerName: "C Date", flex: 1, minWidth: 160 },
    { field: "pAmount", headerName: "Amount", flex: 0.8, minWidth: 100 },
    { field: "inst_rate", headerName: "Rate (%)", flex: 0.7, minWidth: 90 },
    { field: "days", headerName: "Days", flex: 0.5, minWidth: 60 },
    { field: "interestAmount", headerName: "Inst Amount", flex: 1, minWidth: 120 },
    { field: "paid_amt", headerName: "Paid Amount", flex: 0.8, minWidth: 100 },
    { field: "paidby", headerName: "Paid By", flex: 0.8, minWidth: 100 },
    { field: "paidDate", headerName: "Paid Date", flex: 1, minWidth: 150 },
  ];
  const fetchTransactions = async () => {
    try {
      const data = await getApiCallWithParams(`dep-transactions/by-dep/${id}`);
      console.log("DipositorPage transactions", data);
      if (!data || !data || !Array.isArray(data)) {
        setTransactions([]);
        return;
      }
      const pRecord = data.find((item) => item.status === "P");
      setDipositor({ ...dipositor, status: pRecord?.status || 'C' });
      console.log("DipositorPage pendingRecord", pRecord);
      if (pRecord) {
        const days = getDaysBetweenDates(pRecord?.createdAt, new Date());
        const interestAmount = interestCalculation(pRecord.amount, pRecord.inst_rate, days);
        console.log("DipositorPage interestAmount 01", interestAmount);
        pRecord.interestAmount = interestAmount;
        pRecord.totalPendingAmount = +pRecord.amount + interestAmount;
        setPaddingRecord(pRecord);
      }
      if (pRecord) {
        const days = getDaysBetweenDates(pRecord?.createdAt, new Date());
        const interestAmount = interestCalculation(pRecord.amount, pRecord.inst_rate, days);
        pRecord.interestAmount = interestAmount;
        pRecord.totalPendingAmount = +pRecord.amount + interestAmount;
        pRecord.t_id = pRecord.id;
        setPaddingRecord(pRecord);
      }


      const formattedData = data.flatMap(record => {
        return record.details.flatMap((detail, index) => ({
          [detail.p_type]: { ...detail }
        }))
      }

      );
      console.log("DipositorPage formattedData", formattedData);
      const tableData = await Promise.all(

        data.map(async (item, index) => {
          const dateObj = dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss");
          const formattedDate = dateObj;
          const localIntAmount = (item.amount * item.inst_rate * 1) / 100;
          const insAmount = item.status === 'P' ? Math.round((localIntAmount / 365) * getDaysBetweenDates(item.createdAt, new Date())) : item.inst_amt;
          const days = item.status === 'P' ? getDaysBetweenDates(item.createdAt, new Date()) : item.days;
          let createUser = {};
          let paidUser = {};

          try {
            const userRes = item.createdBy && (await getUser("auth/getUser", { id: item.createdBy }));
            createUser = userRes?.user || {};
          } catch (error) {
            createUser = {};
          }
          try {
            const paiddUser = item.paidBy && (await getUser("auth/getUser", { id: +item.paidBy }));
            paidUser = paiddUser?.user || {};
          } catch (error) {
            paidUser = {};
          }
          console.log(" item.details", item)
          return {
            id: item.id || index + 1,
            sno: index + 1,
            createdDate: formattedDate,
            pAmount: item.amount,
            inst_rate: item.inst_rate,
            paid_amt: item.paid_amt,
            type: item.type,
            days: days,
            createdBy: createUser.name || "Unknown",
            interestAmount: insAmount,
            paidby: item.status === 'C' ? item.details[1]?.user?.userId : null,
            updateUser: paidUser.name,
            paidAmount: item.paidAmount,
            status: item.status,
            paidDate: item.status === 'C' ? dayjs(item.details[1]?.t_date).format("DD/MM/YYYY HH:mm:ss") : null,
          };
        })
      );
      console.log("DipositorPage tableData", tableData);
      setTransactions(tableData);



    } catch (error) {
      console.error("Error fetching transactions:", error);
      return;
    }

    /*  try {
       const data = await depTransactions("dipositor/transactions", { id });
       if (!data || !data.transactionList || !Array.isArray(data.transactionList)) {
         setTransactions([]);
         return;
       }
       const pRecord = data.transactionList.find((item) => item.status === "P");
             
       if(pRecord){
         const days = getDaysBetweenDates(pRecord?.createdDate, new Date());
         const interestAmount = interestCalculation(pRecord.pAmount, pRecord.interestRate, days);
         pRecord.interestAmount = interestAmount;
         pRecord.totalPendingAmount = pRecord.pAmount + interestAmount;
       setPaddingRecord(pRecord); */

    /*  }
       
     const tableData = await Promise.all(
      
       data.transactionList.map(async (item, index) => {
         const dateObj = dayjs(item.createdDate).format("DD/MM/YYYY HH:mm:ss"); 
         const formattedDate = dateObj;
         const localIntAmount = (item.pAmount * item.interestRate * 1) / 100;
         const insAmount = item.status === 'P'? Math.round((localIntAmount / 365) * getDaysBetweenDates(item.createdDate, new Date()))  :item.interestAmount
         const days = item.status === 'P'? getDaysBetweenDates(item.createdDate, new Date()):item.days;
         let createUser = {};
         let paidUser = {};
         
         try {
           const userRes = item.createdBy && (await getUser("auth/getUser", { id: item.createdBy }));
           createUser = userRes?.user || {};
         } catch (error) {
           createUser = {};
         }
         try {
           const paiddUser = item.paidBy && (await getUser("auth/getUser", { id: +item.paidBy }));
           paidUser = paiddUser?.user || {};
         } catch (error) {
           paidUser = {};
         }
         


         return {
           id: item.truncationId || index + 1,
           sno: index + 1,
           createdDate: formattedDate,
           pAmount: item.pAmount,
           interest: item.interestRate,
           days: days,
           createdBy: createUser.name || "Unknown",
           interestAmount:insAmount,
           paidby: item.updatedBy,
           updateUser: paidUser.name,
           paidAmount:item.paidAmount,
           status: item.status,
           paidDate: dayjs(item.paidDate).format("DD/MM/YYYY HH:mm:ss"),
         };
       })
     );

     setTransactions(tableData);

   } catch (error) {
     // suppress fetch errors
   } */
  };
  const fethdata = async () => {
    try {
      const res = await getApiCallWithParams(`/depositor/${forumId}/${id}`);
      setResponseData(res);
      console.log("DipositorPage res", resposneData);
      const labels = {
        dipositorId: "Dipositor ID",
        sName: "SurName",
        name: "Name",
        fName: "Father Name",
        defaultPhNo: "Phone Number",
        defaultVillage: "Village",
        isInvester: "Is Invester",
        PPpercentage: "PP Percentage",
        createdBy: "Created By",
        createdAt: "Created At",
      };
      const depDetails = res;
      depDetails.createdAt = dayjs(depDetails.createdAt).format("DD/MM/YYYY HH:mm:ss");
      depDetails.createdBy = "Unknown";
      depDetails.isInvester = "No";
      depDetails.PPpercentage = 0;
      const resData = Object.keys(depDetails.person)
        .filter((key) => labels[key])
        .map((key) => ({ label: labels[key] || key, value: depDetails.person[key] }));
      setHeaderDetails(resData);
    } catch (error) {
      if (error.response.status === 400) {
        navigate('/app/404page')
        console.log('error', error.response.status)
      }
      // suppressed
    }
  }

  useEffect(() => {
    fethdata();
    fetchTransactions();
  }, [id]);


  const addAmtHandler = () => {
    setAddAmount(true);
  };

  return (
    <>
      <AddDepAmount toOpen={addAmount} onClose={() => {
        fetchTransactions();
        fethdata();
        setAddAmount(false);
      }} />
      {pandingRecord && <DepPayment toOpen={depPayment} pandingRecord={{ ...pandingRecord, inst_rate: parseInt(pandingRecord.inst_rate) }} onClose={() => {
        fethdata();
        fetchTransactions();
        setDepPayment(false)
      }} />}
      <DetailsPageHeader option={true} personDetails={resposneData} headerDetails={headerDetails} pageTitle={type} pageName={dipositor.name} pandingRecord={pandingRecord} />
      <br />
      <Card sx={{ minWidth: 275 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Transactions
            </Typography>

            {dipositor.status !== "P" ? <Button variant="outlined" sx={{ backgroundColor: 'white', color: 'red' }} color="error" onClick={addAmtHandler} size="small">
              Add Amount
            </Button> : <Button variant="outlined" sx={{ backgroundColor: 'white', color: 'green' }} onClick={() => setDepPayment(true)} color="success" size="small">
              Payment
            </Button>}

          </Toolbar>
        </AppBar>
        <CardContent>
          <DataGridComponent tableData={transactions} columns={columns} />
        </CardContent>
      </Card>
    </>
  );
};

export default DipositorPage;
