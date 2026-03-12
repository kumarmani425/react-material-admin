import React, { use, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Card, CardContent, Button } from "@mui/material";
import { getDaysBetweenDates, interestCalculation } from "../../utils/utils";

import { getApiCall } from "../../nest_api";
import dayjs from "dayjs";
import MovingIcon from '@mui/icons-material/Moving';
import { Tooltip } from "@mui/material";
import Chip from '@mui/material/Chip';
import DataGridComponent from "../../components/DataGrid/DataGridComponent";
import DetailsPageHeader from "../../components/DetailsPageHeader/DetailsPageHeader";
import ItemTemplate from "../../pages/trader/ItemTemplate/ItemTemplate";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import TocIcon from '@mui/icons-material/Toc';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";

const Stock = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const [traderPurchases, setTraderPurchases] = useState([]);
    const [viewIsTable, setViewIsTable] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [footerTotal, setFooterTotal] = useState({ totalStock: 0, totalAmount: 0 });


    const columns = [
        { field: "sno", headerName: "S.No", flex: 0.3, minWidth: 60 },
        {
            field: "category_name", headerName: "Category Type", flex: 0.3, minWidth: 150,

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
                            component={Link}
                            to={`/app/stockBatchList/${params.row.category_id}`}
                            variant="outlined" />

                    </Tooltip>
                );
            }
        },
        { field: "totalQuantity", headerName: "Quantity", flex: 0.8, minWidth: 100 },
        { field: "aveUnitPrice", headerName: "Unit Price", flex: 0.7, minWidth: 90 },
        { field: "itemCount", headerName: "Total Batchs", flex: 1, minWidth: 120 },
        { field: "totalAmount", headerName: "Total Amount", flex: 1, minWidth: 120 },
    ];
    const fetchTransactions = async () => {
        try {
            const response = await getApiCall("stock-batch/getAllStock");

            const data = response;
            const categorySummaries = data.reduce((acc, item, index) => {
                const cid = item.category_id;

                if (item.status !== "P") return acc;

                // If category not created, initialize it
                if (!acc[cid]) {
                    acc[cid] = {
                        id: index + 1,
                        itemList: [],
                        category_id: cid,
                        category_name: item.category?.c_name || "",
                        totalQuantity: 0,
                        totalAmount: 0,
                        itemCount: 0,
                        aveUnitPrice: 0,
                        t_id: item.stockTransaction?.id || null,
                    };
                }

                // Push item
                acc[cid].itemList.push(item);

                // Add totals
                acc[cid].totalQuantity += parseFloat(item.quantity || 0);
                acc[cid].totalAmount += parseFloat(item.tAmount || 0);
                acc[cid].itemCount += 1;

                // Calculate average AFTER totals updated
                acc[cid].aveUnitPrice = acc[cid].aveUnitPrice =
                    acc[cid].totalQuantity > 0
                        ? parseFloat(
                            (acc[cid].totalAmount / acc[cid].totalQuantity).toFixed(2)
                        )
                        : 0;

                return acc;
            }, {});

            // 3. Convert the summary object into a clean array of results
            const finalResult = Object.values(categorySummaries).map((item, index) => ({
                sno: index + 1, // Index dimulai dari 0, jadi ditambah 1
                ...item
            }));;


            const totalStock = finalResult.reduce((sum, item) => sum + item.totalQuantity, 0);
            const totalAmount = finalResult.reduce((sum, item) => sum + item.totalAmount, 0);
            setFooterTotal({ totalStock, totalAmount });


            setTransactions(finalResult);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }



    };



    useEffect(() => {
        fetchTransactions();
    }, []);


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

            <Card sx={{ minWidth: 275 }}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Stock List
                        </Typography>


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
                        <ItemTemplate transactions={traderPurchases} viewIsTable={viewIsTable} />}
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
                        <Typography variant="body1">📈 Total Stock : {footerTotal.totalStock} </Typography>
                        <Typography variant="body1"> 💰Total Debit : {footerTotal.totalAmount}</Typography>

                    </Box>
                </CardContent>
            </Card>
        </>
    );
};

export default Stock;
