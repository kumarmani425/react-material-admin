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
import ItemTemplate from "../ItemTemplate/ItemTemplate";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import TocIcon from '@mui/icons-material/Toc';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import { Tooltip } from "@mui/material";
import Chip from '@mui/material/Chip';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';
import ButtonGroup from '@mui/material/ButtonGroup';
import PurchasePaymet from "../PurchasePaymet/PurchasePaymet";


const TraderPage = () => {
    const { forumId, id } = useParams();
    const navigate = useNavigate()

    console.log("TraderPage id", useParams());
    const location = useLocation();
    const type = location.state?.type || 'Trader';
    const [pendingPurchases, setPendingPurchases] = useState([]);
    const [addPuchase, setaddPuchase] = useState(false);
    const [depPayment, setDepPayment] = useState(false);
    const [tDetailsResData, setTDetailsResData] = useState({});
    const [traderPurchases, setTraderPurchases] = useState([]);
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
        { field: "balance", headerName: "Balance", flex: 0.8, minWidth: 100 },
        { field: "paidby", headerName: "Paid By", flex: 0.8, minWidth: 100 },
        { field: "paidDate", headerName: "Paid Date", flex: 1, minWidth: 150 },
    ];
    const fetchTransactions = async () => {


        const data = traderPurchases
        console.log("TraderPage table View", data);
        if (!data || !data || !Array.isArray(data)) {
            setTransactions([]);
            return;
        }
        const pRecord = data.filter((item) => item.status !== "C");
        console.log("TraderPage pendingRecord", pRecord);

        if (pRecord) {
            pRecord.totalPendingAmount = pRecord.reduce((sum, item) => {
                if (item.status === 'PP') {
                    return sum + (Number(item.balance) || 0);
                }
                return sum + (Number(item.total_amount) || 0);
            }, 0);

            setPaddingRecord(pRecord);
        }





        const tableData = await Promise.all(

            data.map(async (item, index) => {

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
                    balance: item.balance,
                    paidAmount: 0,
                    paidby: null,
                    updateUser: paidUser.name,

                    status: item.status,
                    paidDate: null,
                };
            })
        );
        const pendingTransactions = tableData.filter(item => item.status !== 'C')

            // 2. Sort based on createdAt
            .sort((a, b) => {
                // Convert "DD/MM/YYYY" to "YYYY-MM-DD" for reliable parsing
                const dateA = new Date(a.createdAt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
                const dateB = new Date(b.createdAt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));

                return dateA - dateB; // Use (dateB - dateA) for Descending order
            });;
        setPendingPurchases(pendingTransactions);
        console.log("TraderPage pendingTransactions", pendingTransactions);
        setTransactions(tableData);



    };
    const fethdata = async () => {
        try {
            const res = await getApiCallWithParams(`/trader/traderDetails/${id}`);
            setTDetailsResData(res);
            console.log("TraderPage res", tDetailsResData);
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
            if (error.response.status === 400) {
                navigate('/app/404page')
            }

        }
    }
    const fetchTraderPurchases = async () => {
        try {
            const data = await getApiCallWithParams(`/trader-purchase/findAllByPersonId/${tDetailsResData.id}`);
            setTraderPurchases(data);

        } catch (error) {
            console.error("Error fetching purchases:", error);
        }
    };
    useEffect(() => {
        fethdata();

    }, [id]);
    useEffect(() => {
        fetchTraderPurchases();

    }, [tDetailsResData]);

    useEffect(() => {
        fetchTransactions();
    }, [traderPurchases]);
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
            <PurchaseFormPopup pendingPurchases={pendingPurchases} toOpen={addPuchase} personDetails={tDetailsResData} onClose={() => {
                fetchTransactions();
                fethdata();
                setaddPuchase(false);
            }} />
            {pandingRecord && <PurchasePaymet pendingPurchases={pendingPurchases} toOpen={depPayment} pandingRecord={{ ...pandingRecord, inst_rate: parseInt(pandingRecord.inst_rate) }} onClose={() => {
                fethdata();
                fetchTransactions();
                setDepPayment(false)
            }} />}
            <DetailsPageHeader icon={SocialDistanceIcon} isTrader={true} option={true} personDetails={tDetailsResData} headerDetails={headerDetails} pageTitle={type} pandingRecord={pandingRecord} />
            <br />
            <Card sx={{ minWidth: 275 }}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Transactions
                        </Typography>
                        <ButtonGroup variant="outlined" aria-label="Basic button group">
                            <Button variant="outlined" sx={{ backgroundColor: 'white', color: 'red' }} color="error" onClick={addAmtHandler} size="small">
                                Add Purchase
                            </Button>
                            {pendingPurchases.length > 0 && (
                                <Button variant="outlined" sx={{ backgroundColor: 'white', color: 'green' }} onClick={() => setDepPayment(true)} color="success" size="small">
                                    Payment
                                </Button>)}
                        </ButtonGroup>
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
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <CardContent>
                    {viewIsTable ? <DataGridComponent tableData={transactions} columns={columns} /> :
                        <ItemTemplate transactions={traderPurchases} viewIsTable={viewIsTable} />}
                </CardContent>
            </Card>
        </>
    );
};

export default TraderPage;
