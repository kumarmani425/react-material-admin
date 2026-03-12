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
import React, { use, useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Link } from "react-router-dom"
import dayjs, { Dayjs } from 'dayjs';
import TimelineIcon from '@mui/icons-material/Timeline';
import { getApiCall, getApiCallWithParams } from "../../nest_api";
import DataGridComponent from "../../components/DataGrid/DataGridComponent";
import MyDatePicker from "../../components/MyDatePicker/MyDatePicker";
import { getAllUsers } from "../../api";
import { Tooltip } from "@mui/material";
import Chip from '@mui/material/Chip';
import { max } from "lodash";
import Fieldset from "../../components/Fieldset/Fieldset";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const DayTrading = () => {
    // Table Columns
    const columns = [
        { field: "sno", headerName: "S.No", flex: 0.5, minWidth: 50 },

        {
            field: "createDate",
            headerName: "Date",
            flex: 1.5,
            minWidth: 160,
            maxWidth: 160,
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
        { field: "information", headerName: "Information", flex: 1, minWidth: 200 },
        {
            field: "category", headerName: "Category", flex: 1, minWidth: 120, renderCell: (params) => {
                const value = params.value
                    ? params.value
                        .toLowerCase()
                        .split(" ")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                    : "";

                return (
                    <Tooltip title={value} arrow>
                        <Chip label={value} color="primary"

                            variant="outlined" />

                    </Tooltip>
                );
            }
        },

        { field: "credit", headerName: "Purchase", flex: 1, minWidth: 100 },
        { field: "debit", headerName: "Sell", flex: 1, minWidth: 100 },
        { field: "user", headerName: "User Id", flex: 1, minWidth: 100 },
    ];

    const loginUser = JSON.parse(localStorage.getItem('user')) || {};
    console.log('loginUser', loginUser)
    const [tableData, setTableData] = useState([]);

    const [grandTotal, setGrandTotal] = useState({ totalPurchase: 0, totalSell: 0, balance: 0 });

    const [dateRange, setDateRange] = useState([dayjs('2025-03-25'), dayjs()]);
    /*  const [value, setValue] = React.useState<DateRange<Dayjs>>([
         dayjs('2022-04-17'),
         dayjs('2022-04-21'),
       ]);
  */
    const totalCredit = tableData.reduce((s, r) => s + +r.credit, 0);
    const totalDebit = tableData.reduce((s, r) => s + +r.debit, 0);
    const blance = totalCredit - totalDebit;

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

            const resData = await getApiCallWithParams('day-trading', params)
            console.log('dates', startDate, endDate);
            console.log('dates', new Date("2025-03-26T00:00:00"), new Date("2025-03-26T23:59:59"));
            console.log('resData', resData);
            const convertData = await Promise.all(resData?.map(async (item, index) => {


                return {
                    id: item.id,
                    sno: index + 1,
                    category: item.coconutCategory
                        .c_name || 'N/A',
                    information: item.info,
                    createDate: dayjs(item.t_date).format("DD-MM-YYYY HH:mm:ss"),
                    user: item.user.userId || 'N/A',
                    credit: item.purchase || 0,
                    debit: item.debit || 0,
                    depId: item.trader_id
                }
            }))
            console.log('resData', resData)
            setTableData(convertData)
            console.log('convertData', data)
        } catch (e) {
            console.log('error', e)
        }

    }

    const getAllTransactions = async () => {
        try {
            const resData = await getApiCall('day-trading/getAllTns')
            const totalPurchase = resData.reduce((s, r) => s + Number(r.purchase), 0);
            const totalSell = resData.reduce((s, r) => s + Number(r.sell), 0);
            const balance = totalPurchase - totalSell;
            setGrandTotal({ totalPurchase, totalSell, balance })
            console.log('resData', resData);
        } catch (e) {
            console.log('error', e)
        }
    }

    useEffect(() => {
        getAllTransactions();
    }, []);
    return (
        <Card sx={{ minWidth: 275 }}>
            <AppBar position="static">
                <Toolbar variant="dense" > <TimelineIcon fontSize="large" sx={{ color: 'white' }} /> &nbsp;
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Day Trading Page
                    </Typography>
                    <MyDatePicker selectData={selectdatas} />
                </Toolbar>
            </AppBar>
            <CardContent>


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
                    <Typography variant="body1">📈 Total Purchased: {totalCredit}</Typography>
                    <Typography variant="body1">📋 Total Sell: {totalDebit}</Typography>
                    <Typography variant="body1">🟢 Balance: {blance}</Typography>
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
                        <Typography variant="body1">📈 Grand Purchased: {grandTotal.totalPurchase}</Typography>
                        <Typography variant="body1">📋 Grand Sell: {grandTotal.totalSell}</Typography>
                        <Typography variant="body1">🟢 Balance: {grandTotal.balance}</Typography>
                    </Box>
                </Fieldset>}
            </CardContent>
        </Card>
    );
};
export default DayTrading;