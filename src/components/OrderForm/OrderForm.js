import React, { use, useEffect, useState } from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Box,
    TextField,
    Autocomplete,
    Grid,
    IconButton,
    Toolbar,
    List,
    ListItem,
    ListItemText,
    Radio,
    AppBar,
    Divider,
    RadioGroup,
    FormControl,
    FormHelperText,
    FormControlLabel,
    ButtonGroup,
    Switch,
    Stack,
    Avatar,
    Chip
} from '@mui/material';
import DatePickerComponent from '../DatePicker/DatePicker';

import {
    Person, Email, Inventory2,
    Layers, Payments, Scale, ShoppingBag, LocationOn
} from '@mui/icons-material';
import { useParams, Navigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { useForm, FormProvider, useFormContext, useFieldArray, Controller } from 'react-hook-form';
import NotificationContext from "../../store/alert-context";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { getApiCallWithParams, getApiCall, postApiCall } from '../../nest_api';
import { useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Fieldset from '../Fieldset/Fieldset';
import { AddCircleOutline } from '@mui/icons-material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import it from 'date-fns/locale/it/index.js';
import BulkPurchaseAndBuyForm from '../BulkPurchaseAndBuyForm/BulkPurchaseAndBuyForm';

const steps = ['Order Details', /* 'Packing Details', 'Transport Details', 'Other Detils', */ 'Review'];

const loginUser = JSON.parse(localStorage.getItem('user'))




function ReviewBlockUi({ userData }) {
    const data = userData
    return (

        <TransactionCards data={data} ></TransactionCards>

    );
};


function PackingDetails() {
    return (
        <>
            <Fieldset title="Packing Details">
                <Typography gutterBottom sx={{ px: 3 }} variant="h6" component="div">

                </Typography>
            </Fieldset>
        </>
    );
}


function TransportDetails() {
    return (
        <>
            <Fieldset title="Transport Details">
                <Typography gutterBottom sx={{ px: 3 }} variant="h6" component="div">
                    Transport Details
                </Typography>
            </Fieldset>
        </>
    );
}

function OtherDetails() {
    return (
        <>
            <Fieldset title="Other Details">
                <Typography gutterBottom sx={{ px: 3 }} variant="h6" component="div">
                    Other Details
                </Typography>
            </Fieldset>
        </>
    );
}

const TransactionCards = ({ data }) => {
    const { buyer, itemDetails } = data;

    return (
        <Box sx={{ p: 3, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            {/* Header / Buyer Section */}
            <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                <Person fontSize="large" />
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>{buyer.person.name}</Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 0.5, color: 'text.secondary' }}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LocationOn fontSize="inherit" /> {buyer.person.village}
                                </Typography>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Email fontSize="inherit" /> {buyer.person.email}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Chip
                                label={buyer.status === 'P' ? 'PENDING' : 'PAID'}
                                color={buyer.status === 'P' ? 'warning' : 'success'}
                                variant="filled"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card sx={{


            }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Inventory2 color="primary" /> Item Details
                    </Typography>

                    {/* Items Grid */}
                    <Grid container spacing={3}>
                        {itemDetails.map((item, index) => (
                            <Grid item xs={12} sm={12} lg={12} key={index}>
                                <Card sx={{
                                    borderRadius: 2,
                                    transition: '0.3s',
                                    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
                                    borderLeft: item.loose === 'loose' ? '6px solid #2e7d32' : '6px solid #d21919',

                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                {item.itemType.name}
                                            </Typography>
                                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                                ₹{item.amount.toLocaleString()}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ mb: 2 }} />

                                        <Grid container justifyContent="center"
                                            alignItems="center" spacing={2}>
                                            <DetailItem icon={<ShoppingBag fontSize="small" />} label="Bags" value={item.bags || 0} />
                                            <DetailItem icon={<Layers fontSize="small" />} label="Bharti" value={item.bharti || 0} />
                                            <DetailItem icon={<Payments fontSize="small" />} label={item.loose === 'loose' ? 'Unit Price' : "Rate/Bag"} value={`₹${item.loose === 'loose' ? item.unitPrice : item.ratePerBag}`} />
                                            <DetailItem icon={<Scale fontSize="small" />} label="Builty Cut" value={item.builtyCut} />
                                            <DetailItem icon={<Scale fontSize="small" />} label="Gross" value={item.gross} />
                                        </Grid>

                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #ddd', display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" color="text.secondary">Type: {item.loose}</Typography>
                                            <Typography variant="caption" color="text.secondary">Nett: {item.nett}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>

                            </Grid>
                        ))}


                    </Grid>
                </CardContent></Card>
            <br></br>
            <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Typography sx={{ pt: 1, pl: 2 }} variant={"h5"} fontWeight="800">
                    Grand Totals
                </Typography>
                <Divider />
                <CardContent>
                    <Grid container spacing={2} justifyContent="center"
                        alignItems="center" >

                        <TotalMetric label="Total Bags" value={data.itemTotals.totalBugs} />
                        <TotalMetric label="Total Gross" value={data.itemTotals.totalGross} />
                        <TotalMetric label="Total Builty" value={data.itemTotals.totalBuilty} />
                        <TotalMetric label="Net Amount" value={`₹${Number(data.itemTotals.totalAmount).toLocaleString()}`} highlight />

                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

// Sub-component for Grand Total Metrics
const TotalMetric = ({ label, value, highlight }) => (
    <Grid item xs={6} sm={3}>
        <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Typography>
        <Typography variant={highlight ? "h5" : "h6"} fontWeight="800">
            {value}
        </Typography>
    </Grid>
);

// Helper component for clean card details
const DetailItem = ({ icon, label, value }) => (
    <Grid item xs={2}>
        <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
            <Box>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ lineHeight: 1 }}>
                    {label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {value}
                </Typography>
            </Box>
        </Stack>
    </Grid>
);

function Review({ data }) {
    console.log("review data", data)
    return (
        <Box>
            <ReviewBlockUi userData={data} />
        </Box>
    );
}


export default function OrderForm({ isPurchase = false, traderDetails }) {
    const [isTrader, setIsTrader] = useState(false)
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const type = searchParams.get("type");
    const alertCtx = useContext(NotificationContext);
    useEffect(() => {
        setIsTrader(isPurchase)
        setValue("date", new Date())

    }, [isPurchase])

    const [activeStep, setActiveStep] = useState(0);
    let methods = useForm({
        defaultValues: {

            itemDetails: [{
                type: null,
                bharti: '',
                ratePerBag: 1000
            }],
        },
        mode: 'onTouched',
    });
    const { handleSubmit, trigger, getValues, reset, setValue } = methods;
    const stepFields = [];

    const validationCheck = async () => {
        if (getValues()?.bankDetails?.length > 0) {
            console.log('banks', getValues())
        }
    };

    const handleNext = async () => {
        validationCheck()
        const valid = await trigger(stepFields[activeStep]);

        if (valid) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };
    const successAction = (res) => {
        alertCtx.setNotification({ message: 'Order created successfully', type: 'success' })
        reset();
        navigate(`/app/order/${loginUser.forum_id}/${res.id}`);
    }

    const failedAction = (error) => {
        const message = error.response?.data?.message || error.message;
        if (message) {
            alertCtx.setNotification({ message: message, type: 'error' })
        } else {
            alertCtx.setNotification({ message: 'An unknown error occurred ', type: 'error' })
        }
        setActiveStep((prev) => 0);
    }


    const onSubmit = async (data) => {

        const itemDetails = data.itemDetails.map((item) => {

            return {
                order_type: item.loose,
                category_id: item?.itemType?.category_id,
                quantity: item.gross,
                total_price: item.amount,
                unit_price: item.loose === 'loose' ? item.unitPrice : item.ratePerBag / 1000,
                builty_cut: item.builtyCut,
                bharti: item.bharti,
                status: 'C'
            }
        })
        const postData = {
            order_date: data.date,
            buyer_id: data.buyer.id,
            totalGross: data.itemTotals.totalGross,
            totalAmount: data.itemTotals.totalAmount,
            status: 'P',
            itemDetails,
        }

        try {
            const createOrderRes = await postApiCall('/orders/createOrder', postData)
            successAction(createOrderRes)
        } catch (err) {
            failedAction(err)
            console.log("create order apiPostcall ", err)
        }
    }



    return (
        <FormProvider {...methods}>
            <AppBar position="static" sx={{ textTransform: "capitalize", borderRadius: '8px 8px 0 0' }}>
                <Toolbar variant="dense">
                    <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isTrader ? 'Trader Bulk Purchase' : 'Buyer Bulk Sell'}
                    </Typography></Toolbar></AppBar>
            <Card elevation={1} >
                <CardContent>
                    <Box >
                        <Card variant="outlined" >
                            <CardContent>
                                <Stepper activeStep={activeStep}>
                                    {steps.map((label, index) => (
                                        <Step sx={{
                                            cursor: "pointer",
                                        }} key={label}>
                                            <StepLabel sx={{ cursor: "pointer" }} onClick={() => {

                                            }} >{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </CardContent>
                        </Card>
                        <Box sx={{ mt: 3 }}>
                            {activeStep === steps.length + 1 ? (
                                <Alert variant="filled" severity="success">
                                    All steps completed — form submitted! This is a success Alert.
                                </Alert>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Card variant="outlined" spacing={2} sx={{ minWidth: '50%', p: 2 }}>
                                        <CardContent>
                                            {activeStep === 0 && <BulkPurchaseAndBuyForm isTrader={isTrader} />}
                                            {/* {activeStep === 1 && <PackingDetails />}
                                            {activeStep === 2 && <TransportDetails />}
                                            {activeStep === 3 && <OtherDetails />} */}
                                            {activeStep === 1 && <Review data={getValues()} />}
                                            <Box sx={{ mt: 2, float: 'right' }}>
                                                <Button
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    type={activeStep === steps.length ? 'submit' : 'button'}
                                                    onClick={activeStep === steps.length ? undefined : handleNext}
                                                >
                                                    {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </form>
                            )}
                        </Box>
                    </Box>
                </CardContent>
                <br />
            </Card>
        </FormProvider>
    );
}
