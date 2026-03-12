import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Box,
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
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Default styles
import "react-date-range/dist/theme/default.css";
import { Link as MuiLink } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Link } from "react-router-dom"
import dayjs, { Dayjs } from 'dayjs';
import { getScroll, getUser } from "../../api";
import { getApiCall, getApiCallWithParams } from "../../nest_api";
import DataGridComponent from "../DataGrid/DataGridComponent";
import MyDatePicker from "../MyDatePicker/MyDatePicker";
import { getAllUsers } from "../../api";
import Fieldset from "../Fieldset/Fieldset";

const Scroll = () => {
  const loginUser = JSON.parse(localStorage.getItem('user')) || {};
  // Table Columns

  const [grandTotals, setGrandTotals] = useState({ totalCredit: 0, totalDebit: 0, balance: 0 });
  const columns = [
    { field: "sno", headerName: "S.No", flex: 0.5, minWidth: 50 },

    {
      field: "createDate",
      headerName: "Date",
      flex: 1.5,
      minWidth: 150,

    },
    {
      field: "depId", headerName: "Department Id", flex: 1, minWidth: 150, renderCell: (params) => (
        <MuiLink
          component={Link}
          to={`/app/dipositor/${params.row.depId}`}
          underline="hover"
        >
          {params.value}
        </MuiLink>
      ),
    },
    { field: "information", headerName: "Information", flex: 1, minWidth: 120 },
    { field: "credit", headerName: "Credit", flex: 1, minWidth: 150 },
    { field: "debit", headerName: "Debit", flex: 1, minWidth: 150 },
    { field: "user", headerName: "User Id", flex: 1, minWidth: 150 },
  ];
  const [tableData, setTableData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs('2025-03-25'), dayjs()]);
  /*  const [value, setValue] = React.useState<DateRange<Dayjs>>([
       dayjs('2022-04-17'),
       dayjs('2022-04-21'),
     ]);
*/
  useEffect(() => {
    getAllTransactions();
  }, []);

  const getAllTransactions = async () => {
    try {
      const resData = await getApiCall('scroll/findAllTnsByForumId')
      const totalCredit = resData.reduce((s, r) => s + Number(r.credit), 0);
      const totalDebit = resData.reduce((s, r) => s + Number(r.debit), 0);
      const balance = totalCredit - totalDebit;
      setGrandTotals({ totalCredit, totalDebit, balance })
      console.log('resData 01', resData);
    } catch (e) {
      console.log('error 01', e)
    }
  }

  const totalCredit = tableData.reduce((s, r) => s + +r.credit, 0);
  const totalDebit = tableData.reduce((s, r) => s + +r.debit, 0);
  const grandTotal = totalCredit - totalDebit;

  const selectdatas = async (data) => {
    const sDate = new Date(dayjs(data[0].startDate).format("YYYY-MM-DD"));
    const eDate = dayjs(data[0].endDate).format("YYYY-MM-DD") + 'T23:59:59';
    const startDate = new Date(sDate);
    const endDate = new Date(eDate);
    /* const startDate = new Date("2025-03-26T00:00:00")
    const endDate = new Date("2025-03-26T23:59:59"); */
    let params = { startDate: startDate, endDate: endDate }
    console.log('data', data)


    try {



      const resData = await getApiCallWithParams('scroll', params)

      console.log('dates', startDate, endDate);
      console.log('dates', new Date("2025-03-26T00:00:00"), new Date("2025-03-26T23:59:59"));



      const convertData = await Promise.all(resData?.map(async (item, index) => {


        return {
          id: item.id,
          sno: index + 1,
          information: item.info,
          createDate: dayjs(item.t_date).format("DD-MM-YYYY HH:mm:ss"),
          user: item.user.userId || 'N/A',
          credit: item.credit || 0,
          debit: item.debit || 0,
          depId: item.dep_id
        }
      }))
      console.log('resData', resData)
      setTableData(convertData)
      console.log('convertData', data)
    } catch (e) {
      console.log('error', e)
    }

    /* const data = [
      { id: 1, name: "Item 1", date: "2024-03-20" },
      { id: 2, name: "Item 2", date: "2024-03-22" },
      { id: 3, name: "Item 3", date: "2024-03-25" },
      { id: 4, name: "Item 4", date: "2024-03-27" },
    ]; */




  }
  const getScrolldata = async () => {
    const response = await getApiCallWithParams('scroll', { startDate: dayjs(dateRange[0]).format("MM-DD-YYYY"), endDate: dayjs(dateRange[1]).format("MM-DD-YYYY") })
    console.log('response', response)
  }
  return (
    <Card sx={{ minWidth: 275 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Scroll Page
          </Typography>
          <MyDatePicker selectData={selectdatas} />
        </Toolbar>
      </AppBar>
      <CardContent>

        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>

        </div>
        <br />
        <DataGridComponent tableData={tableData} columns={columns} />
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            background: "#fff",
            padding: 2,
            borderTop: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body1">💰 Total Credit: {totalCredit}</Typography>
          <Typography variant="body1">📈 Total Debit: {totalDebit}</Typography>
          <Typography variant="body1">🟢 Blance: {grandTotal}</Typography>
        </Box>

        {loginUser.role_id !== 4 && <Fieldset title="Grand Total">
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              background: "#fff",
              /*  border: "1px dashed #03550b",
               borderRadius: 1.5, */
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1">📈 Grand Credit: {grandTotals.totalCredit}</Typography>
            <Typography variant="body1">📋 Grand Debit: {grandTotals.totalDebit}</Typography>
            <Typography variant="body1">🟢 Balance: {grandTotals.balance}</Typography>
          </Box>
        </Fieldset>}
      </CardContent>
    </Card>
  );
};
export default Scroll;