import React, { useEffect, useState } from "react";
import {
    List,
    ListItem,
    Grid,
    Typography,
    Chip,
    Divider,
    Box,
    Card,
    AppBar,
    Toolbar,
    CardContent,
    Button
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getApiCallWithParams } from "../../../nest_api";

const StockBatchList = () => {
    const [stockBatchList, setStockBatchList] = useState([])
    const { cId } = useParams();
    console.log("searchParams", cId);
    const [footerTotals, setFooterTotals] = useState({ pendingStock: 0, traderGrandTotal: 0 });


    const getStockBatchListById = async () => {
        const res = await getApiCallWithParams(`stock-batch/getBatchByCId/${cId}`);
        const filteredRes = res.filter(item => item.status === "P");
        const pendingStock = filteredRes.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        const traderGrandTotal = filteredRes.reduce((sum, item) => sum + (Number(item.tAmount) || 0), 0);
        setFooterTotals({ pendingStock, traderGrandTotal });

        setStockBatchList(filteredRes)
        console.log("filteredRes", filteredRes)
    }

    useEffect(() => {
        getStockBatchListById()
    }, []);

    return (
        <>
            <Card sx={{ minWidth: 275 }}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography variant="h6" textTransform={'uppercase'} sx={{ flexGrow: 1 }}>
                            🥥 {stockBatchList[0]?.category?.c_name}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <CardContent>
                    <Box sx={{ width: "100%" }}>
                        <Grid container sx={{ fontWeight: "bold", p: 2, bgcolor: "#f5f5f5" }}>
                            <Grid item xs={2}>Trader Name</Grid>
                            <Grid item xs={2}>Quantity</Grid>
                            <Grid item xs={2}>Unit Price</Grid>
                            <Grid item xs={2}>Total</Grid>
                            <Grid item xs={2}>Date</Grid>
                            <Grid item xs={2}>Status</Grid>
                        </Grid>

                        <Divider />

                        <List>

                            {stockBatchList.map((item, index) => (
                                <React.Fragment key={item.id || index}>
                                    <ListItem>

                                        <Grid container alignItems="center">

                                            <Grid item xs={2}>
                                                <Typography fontWeight="bold">
                                                    👤 {item.trader?.person.name}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={2}>
                                                {parseFloat(item.quantity).toLocaleString()}
                                            </Grid>

                                            <Grid item xs={2}>
                                                ₹ {parseFloat(item.uCast).toFixed(2)}
                                            </Grid>

                                            <Grid item xs={2} sx={{ color: "green" }}>
                                                ₹ {parseFloat(item.tAmount).toLocaleString()}
                                            </Grid>

                                            <Grid item xs={2}>
                                                {new Date(
                                                    item.stockTransaction?.t_date
                                                ).toLocaleDateString()}
                                            </Grid>

                                            <Grid item xs={2}>
                                                <Chip
                                                    size="small"
                                                    label={item.status === "P" ? "Purchased" : "Sold"}
                                                    color={item.status === "P" ? "primary" : "error"}
                                                />
                                            </Grid>

                                        </Grid>

                                    </ListItem>


                                </React.Fragment>
                            ))}

                        </List>

                    </Box>
                    <Box
                        sx={{
                            position: 'sticky',
                            bottom: 0,
                            background: '#fff',
                            padding: 2,
                            borderTop: '1px solid #ccc',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="body1">📈 Pending stock: {footerTotals.pendingStock}</Typography>
                        <Typography variant="body1">💰 Grand Total: {footerTotals.traderGrandTotal}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
};

export default StockBatchList;