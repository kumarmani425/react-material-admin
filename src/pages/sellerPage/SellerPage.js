import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { DataGrid } from "@mui/x-data-grid";
import MoreIcon from "@mui/icons-material/MoreVert";
import AddDepAmount from "../../components/AddDepAmount/AddDepAmount";
import DepPayment from "../../components/DepPayment/DepPayment";
import { getDaysBetweenDates, interestCalculation } from "../../utils/utils";
import {getUser,getDipositor,depTransactions} from "../../api";
import dayjs from "dayjs";

import { ca } from "date-fns/locale";
import DataGridComponent from "../../components/DataGrid/DataGridComponent";
import DetailsPageHeader from "../../components/DetailsPageHeader/DetailsPageHeader";
const SellerPage = () => {
  const { id } = useParams();
  const [sellerDetails, setSellerDetails] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [addAmount, setAddAmount] = useState(false);
  const  [depPayment, setDepPayment] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [headerDetails, setHeaderDetails] = useState([]);
  const [pandingRecord, setPaddingRecord] = useState({});


  const columns = [
    { field: "sno", headerName: "S.No", flex: 0.3, minWidth: 60 },
    { field: "createdDate", headerName: "Date", flex: 1, minWidth: 150 },
    { field: "pAmount", headerName: "Amount", flex: 0.8, minWidth: 100 },
    { field: "interest", headerName: "Interest Rate", flex: 0.7, minWidth: 90 },
    { field: "days", headerName: "Days", flex: 0.5, minWidth: 60 },
    { field: "createdBy", headerName: "Created By", flex: 1, minWidth: 150 },
    { field: "interestAmount", headerName: "Interest Amount", flex: 0.8, minWidth: 100 },
    { field: "paidAmount", headerName: "Paid Amount", flex: 0.8, minWidth: 100 },
    { field: "updateUser", headerName: "Paid By", flex: 0.8, minWidth: 100 },
    { field: "paidDate", headerName: "Paid Date", flex: 1, minWidth: 150 },
  ];
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const fetchTransactions = async () => {
    try {
      const data = await depTransactions("dipositor/transactions",{id}) 
      if (!data || !data.transactionList || !Array.isArray(data.transactionList)) {
        console.error("Invalid transactions data:", data);
        setTransactions([]);
        return;
      }
      const pRecord = data.transactionList.find((item) => item.status === "P");
            
      if(pRecord){
        const days = getDaysBetweenDates(pRecord?.createdDate, new Date());
        const interestAmount = interestCalculation(pRecord.pAmount, pRecord.interestRate, days);
        pRecord.interestAmount = interestAmount;
        pRecord.totalPendingAmount = pRecord.pAmount + interestAmount;
      setPaddingRecord(pRecord);
      
      }
        
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
            const userRes = item.createdBy&& await getUser("auth/getUser", {id: item.createdBy});
            console.log("userRes",userRes);
            createUser = userRes.user || {};
          } catch (error) {
            console.error("Error fetching user:", error);
          }
          try {
            const paiddUser = item.paidBy && await getUser("auth/getUser", {id: +item.paidBy});
            console.log("userRes",paiddUser);
            paidUser = paiddUser.user || {};
          } catch (error) {
            console.error("Error fetching user:", error);
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
      console.error("Error fetching transactions:", error);
    }
  };
  const fetchData = async () => {
    try {
      const labels = {
        name: "Name",
        fName: "Father Name",
        phNumber: "Phone Number",
        village: "Village",
        createdBy: "Created By",
        createdAt: "Created At",
      };
  
      console.log("id", id);
  
      const res = await getDipositor("seller/getSeller", { id });
      if (!res?.seller) throw new Error("Seller data not found");
  
      const sellerObject = res.seller;
      setSellerDetails(sellerObject)
      // Fetch user details
      const userDetails = await getUser("auth/getUser", { id: sellerObject.createdBy });
      
      
      // Update createdBy and createdAt
      sellerObject.createdBy = userDetails?.user?.userId || "Unknown";
      sellerObject.createdAt = dayjs(sellerObject.createdAt).format("DD/MM/YYYY HH:mm:ss");
  
      // Map response using `.map()`
      const mapResponse = Object.keys(sellerObject)
        .filter(key => labels[key]) // Only include keys that have labels
        .map(key => ({
          label: labels[key] || key,
          value: sellerObject[key],
        }));
  
      setHeaderDetails(mapResponse);
    } catch (error) {
      console.error("Error fetching depositor:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
    fetchTransactions();
  }, [id]);
  

  const addAmtHandler = () => {
    setAddAmount(true);
    handleClose();
  };

  


  return (
    <>
    <DetailsPageHeader headerDetails={headerDetails}  pageName = {sellerDetails.name} pendingRecord = {pandingRecord}/>
      <br />
      <Card sx={{ minWidth: 275 }}>
        <AppBar position="static">
                  <Toolbar variant="dense">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      Transactions
                    </Typography> 
                    
                   { sellerDetails.status !== "P" ? <Button variant="outlined" sx = {{backgroundColor:'white',color:'red'}} color="error"  onClick={addAmtHandler} size="small">
          Add Amount
        </Button>:<Button variant="outlined" sx = {{backgroundColor:'white',color:'green'}} onClick={() => setDepPayment(true)} color="success" size="small">
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

export default SellerPage;
