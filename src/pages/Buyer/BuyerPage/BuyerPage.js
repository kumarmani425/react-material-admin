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
        { field: "order_id", headerName: "Order Id", flex: 1, minWidth: 160 },
        { field: "total_amount", headerName: "Total Amount", flex: 1, minWidth: 160 },
        { field: "items", headerName: "No Of Items", flex: 1, minWidth: 160 },
        { field: "quantity", headerName: "Quantity", flex: 0.8, minWidth: 100 },
        { field: "userId", headerName: "Create BY", flex: 1, minWidth: 160 },
        { field: "createdAt", headerName: "Created Date", flex: 0.7, minWidth: 90 },



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
            pRecord.totalPendingAmount = pRecord.reduce((sum, item) => {
                if (item.status === 'PP') {
                    return sum + (Number(item.order.balance) || 0);
                }
                return sum + (Number(item.order.totalAmount) || 0);
            }, 0);

            setPaddingRecord(pRecord);
        }


        const tableData = await Promise.all(
            data.map(async (item, index) => {
                console.log("item", item)
                const dateObj = dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss");
                const formattedDate = dateObj;
                const itemsWithName = item.order.items.map(item => ({ ...item, name: item.category.c_name }))
                const quantity = item.order.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);


                return {
                    id: item.id || index + 1,
                    sno: index + 1,
                    createdAt: dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss"),
                    total_amount: item.total_price,
                    order_id: item.order_id,
                    userId: item.user.userId,
                    items: item.order.items.length,
                    quantity,
                    orderDetails: itemsWithName,
                    status: item.status
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
            if (tDetailsResData && tDetailsResData.id) {
                const data = await getApiCallWithParams(`/buyer-transactions/getAllBuyerTnsById/${tDetailsResData.id}`);
                console.log("fetchbuyerPurchases ", data)
                setbuyerPurchases(data);
            }

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
                    {viewIsTable ? <DataGridComponent isOpenModal={true} tableData={transactions} pageLink={'sdf'} columns={columns} /> :
                        <ItemTemplate transactions={buyerPurchases} viewIsTable={viewIsTable} />}
                </CardContent>
            </Card>
        </>
    );
};

export default BuyerPage;
