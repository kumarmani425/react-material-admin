import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    Button,
    FormControl,
    InputLabel,
    InputAdornment,
    Select,
    MenuItem,
    Grid,
    Box,
    CircularProgress,
    FormHelperText,
    Autocomplete
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NumbersIcon from "@mui/icons-material/Numbers";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import DatePickerComponent from "../components/DatePicker/DatePicker";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getApiCall, postApiCall } from "../nest_api";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import JoinLeftIcon from '@mui/icons-material/JoinLeft';
import LensIcon from '@mui/icons-material/Lens';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import { set } from "lodash";
const orderTypes = [{ type: "Order", status: 'O' }, {
    type: 'Purchase',
    status: 'P'
}];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

export default function PurchaseFormPopup({ toOpen, onClose, personDetails }) {
    const [open, setOpen] = React.useState(toOpen);
    const [categoriesList, setCategoriesList] = React.useState([]);
    const [personsDetails, setPersonsDetails] = React.useState(personDetails);
    const [loading, setLoading] = React.useState(false);

    const getCategoriesList = async () => {
        try {
            const response = await getApiCall('/coconut-categories/getCategoriesList')
            setCategoriesList(response)
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
    React.useEffect(() => {
        console.log("Person Details in Purchase Form:", personDetails);
        setPersonsDetails[personDetails]
        getCategoriesList();
        setOpen(toOpen);
    }, [toOpen]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        getValues
    } = useForm({
        defaultValues: {
            date: new Date(),
            category: "",
            orderType: "",
            quantity: 0,
            unitPrice: 0,
            totalPrice: 0,
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Replace with your actual API call for purchase
            // await postApiCall('/purchase', data);

            const payload = {
                createdAt: data.date,
                seller_id: personDetails.id,
                t_date: new Date(),
                category_id: data.category,
                quantity: data.quantity,
                unit_price: data.unitPrice,
                bonus: data.bonus,
                p_id: personDetails.p_id,
                total_amount: data.totalPrice,
                //status: data.orderType || 'O',
                status: 'P',
            }
            const response = await postApiCall('/trader-purchase/addPurchase', payload);
            setOpen(false);
            reset();
            if (onClose) onClose();
        } catch (error) {
            console.error("Error submitting purchase form:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose();
    };

    const onBlur = (data) => {
        console.log(data)
    }

    return (
        <BootstrapDialog
            maxWidth="sm"
            fullWidth
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle
                sx={{
                    m: 0, p: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
                id="customized-dialog-title"
            >
                <ShoppingCartIcon sx={{
                    color: "white !important",
                }} /> Add Purchase
            </DialogTitle>

            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: "white !important",
                }}
            >
                <CloseIcon sx={{
                    color: "white !important",
                }} />
            </IconButton>

            <DialogContent dividers sx={{ p: 3 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <Grid container spacing={3}>
                        {/* Date Picker Row */}
                        <Grid item xs={12} md={6}>
                            <DatePickerComponent controlForm1={control} errorsForm1={errors} onBlur={onBlur} />
                        </Grid>

                        {/* Category Field */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!errors.category} size="small">
                                <InputLabel id="category-select-label">Category</InputLabel>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: "Category is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="category-select-label"
                                            label="Category"
                                            value={field.value || ""}
                                            startAdornment={<CategoryIcon sx={{ mr: 1, color: 'action.active' }} fontSize="small" />}
                                        >
                                            {categoriesList && categoriesList.length > 0 ? categoriesList.map((cat) => (
                                                <MenuItem key={cat.c_id} value={cat.id}>{cat.c_name}</MenuItem>
                                            )) : <MenuItem value="" disabled>No categories</MenuItem>}
                                        </Select>
                                    )}
                                />
                                {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        {/* Order Type Field */}
                        {/*  <Grid item xs={12} md={6}>

                            <FormControl fullWidth error={!!errors.orderType} size="small">
                                <InputLabel id="order-type-select-label">Order Type</InputLabel>
                                <Controller
                                    name="orderType"
                                    control={control}
                                    rules={{ required: "Order type is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="order-type-select-label"
                                            label="Order Type"
                                            value={field.value || ""}
                                            startAdornment={<ListAltIcon sx={{ mr: 1, color: 'action.active' }} fontSize="small" />}
                                        >
                                            {orderTypes.map((type) => (
                                                <MenuItem key={type.type} value={type.status}>{type.type}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.orderType && <FormHelperText>{errors.orderType.message}</FormHelperText>}
                            </FormControl>
                        </Grid> */}

                        {/* Quantity Field */}
                        <Grid item xs={12} md={5}>
                            <Controller
                                name="totalQuantity"
                                control={control}
                                rules={{
                                    required: "totalQuantity is required",
                                    min: { value: 1, message: "totalQuantity must be at least 1" },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value === undefined || field.value === null ? 0 : field.value}
                                        label="Total Quantity"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        onChange={e => {
                                            field.onChange(e);

                                            setValue('totalPrice', (getValues('unitPrice') || 0) * (e.target.value || 0));
                                            setValue('bonus', (getValues('totalQuantity') || 0) * 0.1);
                                            setValue('quantity', (getValues('totalQuantity') || 0) - (parseInt(getValues('bonus')) || 0))
                                        }}
                                        error={!!errors.totalQuantity}
                                        helperText={errors.totalQuantity?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <JoinLeftIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="quantity"
                                control={control}
                                rules={{
                                    required: "Quantity is required",
                                    min: { value: 1, message: "Quantity must be at least 1" },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value === undefined || field.value === null ? 0 : field.value}
                                        label="Quantity"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        onChange={e => {
                                            field.onChange(e);
                                            setValue('quantity', e.target.value);
                                            setValue('bonus', (parseInt(getValues('totalQuantity')) || 0) - (parseInt(e.target.value) || 0))
                                        }}
                                        error={!!errors.quantity}
                                        helperText={errors.quantity?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LensIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* Bonus Field */}
                        <Grid item xs={12} md={3}>
                            <Controller
                                name="bonus"
                                control={control}
                                rules={{
                                    required: "Bonus is required",

                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value === undefined || field.value === null ? 0 : field.value}
                                        label="Bonus Quantity"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        error={!!errors.bonus}
                                        onChange={e => {
                                            field.onChange(e);
                                            setValue('bonus', e.target.value);
                                            setValue('quantity', (parseInt(getValues('totalQuantity')) || 0) - (parseInt(e.target.value) || 0))
                                        }}
                                        helperText={errors.bonus?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PanoramaFishEyeIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {/* Unit Price Field */}
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="unitPrice"
                                control={control}
                                rules={{
                                    required: "Unit price is required",
                                    min: { value: 0.01, message: "Price must be greater than 0" },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value === undefined || field.value === null ? 0 : field.value}
                                        label="Unit Price"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        onChange={e => {
                                            field.onChange(e);
                                            setValue('unitPrice', e.target.value);
                                            setValue('totalPrice', (getValues('quantity') || 0) * (e.target.value || 0));
                                        }}
                                        error={!!errors.unitPrice}
                                        helperText={errors.unitPrice?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyRupeeIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Total Price Field */}
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="totalPrice"
                                control={control}
                                rules={{
                                    required: "Total price is required",
                                    min: { value: 0.01, message: "Price must be greater than 0" },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value === undefined || field.value === null ? 0 : field.value}
                                        label="Total Price"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        error={!!errors.totalPrice}
                                        helperText={errors.totalPrice?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PriceCheckIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                    />
                                )}
                            />
                        </Grid>

                        {/* Action Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading}
                                sx={{ mt: 1, height: 48 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Save Purchase"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    );
}