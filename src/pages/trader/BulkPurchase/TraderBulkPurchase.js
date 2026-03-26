import React, { useEffect, useContext } from 'react';
import { Container, Typography, Divider, Box, AppBar, Toolbar, Button, CssBaseline } from '@mui/material';
import PopLayout from '../../../components/PopLayout/PopLayout';
import OrderForm from '../../../components/OrderForm/OrderForm';
import { postApiCall } from '../../../nest_api';
import BulkPurchaseAndBuyForm from '../../../components/BulkPurchaseAndBuyForm/BulkPurchaseAndBuyForm';
import { useForm, FormProvider, useFormContext, useFieldArray, Controller } from 'react-hook-form';
import NotificationContext from '../../../store/alert-context';


export default function TraderBulkPurchase({ open, onClose, isPurchase, traderDetails }) {
    const alertCtx = useContext(NotificationContext);
    let methods = useForm({
        defaultValues: {
            trader: { id: traderDetails?.id, name: traderDetails?.person?.name, village: traderDetails?.person?.village },
            itemDetails: [{
                type: null,
                bharti: '',
                ratePerBag: 1000
            }],
        },
        mode: 'onTouched',
    });
    const { handleSubmit, trigger, getValues, reset, setValue } = methods;
    useEffect(() => {
        console.log("isPurchase 01", isPurchase);
        const trader = { id: traderDetails?.id, name: traderDetails?.person?.name, village: traderDetails?.person?.village }
        setValue('trader', trader)
        setValue('date', new Date())
    }, [traderDetails])

    const successAction = (res) => {
        console.log("res after create person", res.navigteId);
        alertCtx.setNotification({ message: 'Purchase Items successfully', type: 'success' })
        reset();

    }
    const failedAction = (error) => {
        const message = error.response?.data?.message || error.message;
        if (message) {
            alertCtx.setNotification({ message: message, type: 'error' })
        } else {
            alertCtx.setNotification({ message: 'An unknown error occurred', type: 'error' })
        }
        setActiveStep((prev) => 0);
    }

    const onSubmit = async (data) => {
        const itemDetails = data.itemDetails.map((item) => ({
            category_id: item.itemType.id,
            quantity: item.gross,
            unit_price: item.loose === 'loose' ? item.unitPrice : (item.ratePerBag / 1000).toFixed(2),
            builty_cut: item.builtyCut,
            bharti: item.bharti,
            amount: item.amount,
            purchase_type: item.loose,
            status: 'P'
        }))
        const postData = {
            trader_id: data.trader.id,
            status: 'P',
            balance: 0,
            t_date: new Date(),
            total_amount: data.itemTotals.totalAmount,
            createdAt: data.date,
            itemDetails
        }

        try {
            const createOrderRes = await postApiCall('/trader-purchase/addPurchase', postData);
            successAction(createOrderRes)
            closeHanduler();

        } catch (err) {
            console.log("create order apiPostcall ", err)
            failedAction(err)
        }

    }

    const closeHanduler = () => {
        reset();
        onClose()
    }


    return (
        <React.Fragment>
            <PopLayout open={open} size="xl" onClose={onClose} >
                <Toolbar variant="dense">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Trader Bulk Purchase
                    </Typography>
                </Toolbar>
                <Divider />
                <Box sx={{ px: 5 }}>



                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormProvider {...methods}>
                            <BulkPurchaseAndBuyForm traderDetails={!!traderDetails} isTrader={isPurchase} />
                        </FormProvider>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="outlined" type="submit">
                                Submit
                            </Button>
                            <Button variant="outlined" type="button" onClick={() => { closeHanduler() }} color="error">
                                colse
                            </Button>
                        </Box>
                    </form>
                </Box>
            </PopLayout>
        </React.Fragment>
    );
}
