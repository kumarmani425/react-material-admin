import React, { use, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Card, CardContent, Button } from "@mui/material";
import AddDepAmount from "../../../components/AddDepAmount/AddDepAmount";
import DepPayment from "../../../components/DepPayment/DepPayment";
import { getDaysBetweenDates, interestCalculation } from "../../../utils/utils";

import { getApiCallWithParams } from "../../../nest_api";
import dayjs from "dayjs";
import MovingIcon from '@mui/icons-material/Moving';

import DataGridComponent from "../../../components/DataGrid/DataGridComponent";
import DetailsPageHeader from "../../../components/DetailsPageHeader/DetailsPageHeader";
import PurchaseFormPopup from '../../../Purchase/AddPurchase';
import ItemTemplate from "../../trader/ItemTemplate/ItemTemplate";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import TocIcon from '@mui/icons-material/Toc';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import { Tooltip } from "@mui/material";
import Chip from '@mui/material/Chip';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';


const BuyerPage = () => {
    const { forumId, id } = useParams();

    const location = useLocation();
    const type = location.state?.type || 'Buyer';

    const [addPuchase, setaddPuchase] = useState(false);
    const [depPayment, setDepPayment] = useState(false);
    const [tDetailsResData, setTDetailsResData] = useState({});
    const [buyerPurchases, setbuyerPurchases] = useState([]);
    const [viewIsTable, setViewIsTable] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [pandingRecord, setPaddingRecord] = useState({ interestAmount: 0, totalPendingAmount: 0 });
    const [headerDetails, setHeaderDetails] = useState([]);

    const columns = [
        { field: "sno", headerName: "S.No", flex: 0.3, minWidth: 60 },
        {
            field: "type", headerName: "Type", flex: 0.3, minWidth: 130,
            renderCell: (params) => {
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
        { field: "createdAt", headerName: "C Date", flex: 1, minWidth: 160 },
        { field: "quantity", headerName: "Quantity", flex: 0.8, minWidth: 100 },
        { field: "unit_price", headerName: "Unit Price", flex: 0.7, minWidth: 90 },
        { field: "days", headerName: "Days", flex: 0.5, minWidth: 60 },
        { field: "total_amount", headerName: "Total Amount", flex: 1, minWidth: 120 },
        { field: "create_by", headerName: "Create BY", flex: 1, minWidth: 120 },
        { field: "paid_amt", headerName: "Paid Amount", flex: 0.8, minWidth: 100 },
        { field: "paidby", headerName: "Paid By", flex: 0.8, minWidth: 100 },
        { field: "paidDate", headerName: "Paid Date", flex: 1, minWidth: 150 },
    ];
    const fetchTransactions = async () => {
        const data = buyerPurchases
        console.log("buyerPage table View", data);
        if (!data || !data || !Array.isArray(data)) {
            setTransactions([]);
            return;
        }
        const pRecord = data.filter((item) => item.status !== "C");
        console.log("buyerPage pendingRecord", pRecord);

        if (pRecord) {
            pRecord.totalPendingAmount = pRecord.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0);
            setPaddingRecord(pRecord);
        }


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

                return {
                    id: item.id || index + 1,
                    sno: index + 1,
                    createdAt: dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss"),
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total_amount: item.total_amount,
                    create_by: item.user.userId || "Unknown",
                    type: item.cDetails.c_name,
                    days: days,
                    paidAmount: 0,
                    paidby: null,
                    updateUser: paidUser.name,
                    status: item.status,
                    paidDate: null,
                };
            })
        );

        setTransactions(tableData);



    };
    const fethdata = async () => {
        try {
            const res = await getApiCallWithParams(`/buyer/buyerDetails/${id}`);
            setTDetailsResData(res);
            console.log("buyerPage res", tDetailsResData);
            const labels = {
                dipositorId: "Dipositor ID",
                sName: "SurName",
                cName: "Caste Name",
                name: "Name",
                fName: "Father Name",
                defaultPhNo: "Phone Number",
                village: "Village",
                isInvester: "Is Invester",
                PPpercentage: "PP Percentage",
                createdAt: "Created By",
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
            /*  if (error.response.status === 400) {
                 navigate('/app/404page')
             } */

        }
    }
    const fetchbuyerPurchases = async () => {
        try {
            const data = await getApiCallWithParams(`/buyer-purchase/findAllByPersonId/${tDetailsResData.id}`);
            setbuyerPurchases(data);

        } catch (error) {
            console.error("Error fetching purchases:", error);
        }
    };
    useEffect(() => {
        fethdata();

    }, [id]);
    useEffect(() => {
        fetchbuyerPurchases();

    }, [tDetailsResData]);

    useEffect(() => {
        fetchTransactions();
    }, [buyerPurchases]);
    const addAmtHandler = () => {
        setaddPuchase(true);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {/* <AddDepAmount toOpen={addPuchase} onClose={() => {
                fetchTransactions();
                fethdata();
                setaddPuchase(false);
            }} /> */}

            <PurchaseFormPopup toOpen={addPuchase} personDetails={tDetailsResData} onClose={() => {
                fetchTransactions();
                fethdata();
                setaddPuchase(false);
            }} />
            {pandingRecord && <DepPayment toOpen={depPayment} pandingRecord={{ ...pandingRecord, inst_rate: parseInt(pandingRecord.inst_rate) }} onClose={() => {
                fethdata();
                fetchTransactions();
                setDepPayment(false)
            }} />}
            <DetailsPageHeader icon={ConnectWithoutContactIcon} isTrader={true} option={true} personDetails={tDetailsResData} headerDetails={headerDetails} pageTitle={type} pandingRecord={pandingRecord} />
            <br />
            <Card sx={{ minWidth: 275 }}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Transactions
                        </Typography>

                        <Button variant="outlined" sx={{ backgroundColor: 'white', color: 'red' }} color="error" onClick={addAmtHandler} size="small">
                            Add Purchase
                        </Button>
                        <div>
                            <IconButton
                                sx={{ color: 'white' }}
                                aria-label="more"
                                id="long-button"
                                aria-controls={open ? 'long-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <MoreVertIcon sx={{ color: 'white' }} />
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                slotProps={{
                                    list: {
                                        'aria-labelledby': 'basic-button',
                                    },
                                }}
                            >
                                {viewIsTable ? <MenuItem hidden onClick={() => { setViewIsTable(false); setAnchorEl(null); }}><TocIcon /> Table View </MenuItem> : <MenuItem onClick={() => { setViewIsTable(true); setAnchorEl(null); }}> <ViewStreamIcon /> Card View</MenuItem>}
                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <CardContent>
                    {viewIsTable ? <DataGridComponent tableData={transactions} columns={columns} /> :
                        <ItemTemplate transactions={buyerPurchases} viewIsTable={viewIsTable} />}
                </CardContent>
            </Card>
        </>
    );
};

export default BuyerPage;
