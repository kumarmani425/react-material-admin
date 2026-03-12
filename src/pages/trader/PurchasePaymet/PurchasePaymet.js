import * as React from "react";
import { useForm, Controller, get, useFieldArray, useWatch } from "react-hook-form";
import {
    Grid, Dialog, DialogTitle, DialogContent, IconButton, TextField, Typography,
    Box, InputLabel, FormControl, Divider, Autocomplete, FormHelperText, InputAdornment, styled,
    Card, CardContent, Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import JoinLeftIcon from '@mui/icons-material/JoinLeft';
import DatePickerComponent from "../../../components/DatePicker/DatePicker";
import Fieldset from "../../../components/Fieldset/Fieldset";
import { postApiCall } from "../../../nest_api";
import { useContext } from "react";
import NotificationContext from "../../../store/alert-context";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": { padding: theme.spacing(2) },
    "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export default function PurchasePayment({ toOpen, onClose, pandingRecord, pendingPurchases }) {
    const [open, setOpen] = React.useState(toOpen);
    const alertCtx = useContext(NotificationContext);
    const purchaseOptions = React.useMemo(() =>
        (pendingPurchases || []).map((pp, index) => (
            `${index + 1}`)), [pendingPurchases]);

    const {
        handleSubmit,
        control,
        setValue,
        getValues,
        watch,
        formState: { errors },
        reset,

    } = useForm({
        defaultValues: {
            purchaseList: pendingPurchases.length,
            date: new Date(),
            interestRate: 0,
            totalQuantity: 0,
            balance: 0,
            records: pendingPurchases.map(p => {
                if (p.status === 'PP') {
                    return {
                        ...p,
                        total_amount: p.balance,
                        totalQuantity: 0, balance: 0
                    }
                }
                return {
                    ...p,
                    totalQuantity: 0, balance: 0
                }
            })
        }
    });


    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'records',
    });


    // Sync form with props when dialog opens
    React.useEffect(() => {
        setOpen(toOpen);
        if (toOpen) {
            reset({
                date: new Date(),
                interestRate: pandingRecord?.inst_rate || 0,
                purchaseList: pendingPurchases.length,
                totalQuantity: 0,
                records: pendingPurchases.map(p => {
                    if (p.status === 'PP') {
                        return {
                            ...p,
                            total_amount: p.balance,
                            totalQuantity: 0, balance: 0
                        }
                    }
                    return {
                        ...p,
                        totalQuantity: 0, balance: 0
                    }
                })
            });
        }
        console.log("puchase payment pendingPurchases", pendingPurchases);
    }, [toOpen, pandingRecord, reset]);

    const handleClose = () => {
        setOpen(false);
        onClose?.();
    };
    const successAction = (res) => {

        console.log("res after create person", res.navigteId);
        alertCtx.setNotification({ message: 'Payment successful!', type: 'success' })
        handleClose()

    }
    const failedAction = (error) => {
        const message = error.response?.data?.message || error.message;
        if (message) {
            alertCtx.setNotification({ message: message, type: 'error' })
        } else {
            alertCtx.setNotification({ message: 'An unknown error occurred fgfdg', type: 'error' })
        }

    }



    const onSubmit = async (data) => {
        console.log("Form Data:", data);
        try {
            const postData = data.records.map((rec) => ({
                purchase_id: rec.id,
                amount: rec.paid_amount,
                payment_mode: 1,
                payment_date: new Date(data.date),
                status: 'P',
                balance: rec.balance,
                payment_type: rec.status
            }))
            const purchagePaymentRes = await postApiCall('purchase-payments/postPurchasePayments', postData)
            successAction(purchagePaymentRes)
            handleClose()
        } catch (err) {
            failedAction(err)
            console.log("err", err.response.data.message)
        }
    };

    const records = useWatch({
        control,
        name: "records"
    });

    const grandTotalPaid = records?.reduce(
        (sum, item) => sum + (Number(item?.paid_amount) || 0),
        0
    );
    return (
        <BootstrapDialog maxWidth="md" onClose={handleClose} open={open}>
            <DialogTitle sx={{ m: 0, p: 1.5, bgcolor: 'primary.main', color: 'white' }}>
                Payment
            </DialogTitle>
            <IconButton
                onClick={handleClose}
                sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
            >
                <CloseIcon sx={{ color: "white" }} />
            </IconButton>

            <DialogContent dividers sx={{ minWidth: "900px" }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box component="form" noValidate>
                        <Grid container justifyContent="center" spacing={2}>
                            {/* Date Picker */}
                            <Grid item xs={12} md={4}>
                                <DatePickerComponent
                                    label="Payment Date"
                                    controlForm1={control}
                                    errorsForm1={errors}
                                />
                            </Grid>

                            {/* Purchase List Autocomplete */}
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth error={!!errors.purchaseList} size="small">
                                    <Controller
                                        name="purchaseList"
                                        control={control}
                                        rules={{ required: "Please select a purchase" }}
                                        render={({ field: { onChange, value } }) => (
                                            <Autocomplete
                                                options={purchaseOptions}
                                                getOptionLabel={(option) => String(option) || ""}
                                                value={value || null}
                                                onChange={(_, newValue) => {

                                                    onChange(newValue);

                                                    const count = Number(newValue);

                                                    const selectedRecords = pendingPurchases
                                                        .slice(0, count)
                                                        .map(p => {
                                                            const paid_amount = p.paid_amount;
                                                            // Assuming full payment for simplicity
                                                            console.log("paid_amount", paid_amount, p.total_amount);
                                                            const balance = p.total_amount - paid_amount;
                                                            const status = paid_amount === p.total_amount ? 'C' : paid_amount < p.total_amount ? 'PP' : 'P';
                                                            return {
                                                                ...p,
                                                                totalQuantity: 0,
                                                                balance: 0
                                                            }
                                                        });

                                                    replace(selectedRecords);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        label="Select Purchase"
                                                        error={!!errors.purchaseList}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                    {errors.purchaseList && (
                                        <FormHelperText>{errors.purchaseList.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Divider sx={{ width: '100%', my: 2 }} />
                        {fields.length > 0 && fields.map((purchase, index) => (<> <Fieldset status={records?.[index]?.status} title={`${purchase.sno}) ${purchase.type}`}>

                            <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
                                <>
                                    <Grid item xs={12} alignItems="center" justifyContent="stretch" md={3}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {purchase.createdAt}
                                        </Typography>

                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Controller
                                            name={`records[${index}].total_amount`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Total Price"
                                                    value={field.value}
                                                    readOnly
                                                    type="number"
                                                    size="small"
                                                    fullWidth
                                                    InputProps={{
                                                        readOnly: true
                                                    }}
                                                    onChange={(e) => {
                                                        const val = parseFloat(e.target.value);
                                                        field.onChange(val);
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Controller
                                            name={`records[${index}].paid_amount`}
                                            control={control}
                                            rules={{
                                                required: "Paid amount is required",
                                                max: {
                                                    value: records?.[index]?.total_amount || 0,
                                                    message: "Paid amount cannot exceed total amount"
                                                }
                                            }}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    {...field}
                                                    label="Paid Amount"
                                                    type="number"
                                                    size="small"
                                                    fullWidth
                                                    value={field.value || ''}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    onChange={(e) => {
                                                        const paid = parseFloat(e.target.value) || 0;
                                                        field.onChange(paid);
                                                        const total = getValues(`records[${index}].total_amount`) || 0;
                                                        setValue(`records[${index}].balance`, total - Number(paid));
                                                        const status = Number(total) === paid ? 'C' : Number(total) <= paid ? 'P' : 'PP';
                                                        console.log("status paid feild", status, total, paid);
                                                        setValue(`records[${index}].status`, status);
                                                        console.log(getValues(`records[${index}].balance`), `${index}`);
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {records?.[index]?.balance}
                                        </Typography>

                                    </Grid>
                                </>

                            </Grid>

                        </Fieldset> </>
                        ))
                        }

                        <Grid justifyContent="flex-end" alignItems="center" spacing={2}>
                            <Grid item xs={12} md={3} textAlign="right">
                                <Typography gutterBottom variant="h6">
                                    Total : {grandTotalPaid}
                                </Typography>


                            </Grid>
                        </Grid>
                    </Box>
                    <Divider sx={{ width: '100%', my: 2 }} />
                    <Grid container justifyContent="flex-end" spacing={4}>
                        <Grid item xs={12} md={3}>
                            {getValues("purchaseList") && <Button type="submit" variant="outlined" onClick={handleSubmit(onSubmit)}>
                                Submit
                            </Button>}
                            <Button type="submit" variant="outlined" onClick={() => handleClose()}>
                                Cancel
                            </Button>
                        </Grid>

                    </Grid>
                </form>
            </DialogContent>
        </BootstrapDialog>
    );
}
