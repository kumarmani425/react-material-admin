import React, { useState, useEffect } from 'react';
import Fieldset from '../Fieldset/Fieldset';
import { useForm, FormProvider, useFormContext, useFieldArray, Controller } from 'react-hook-form';
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
} from '@mui/material'

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getApiCall } from '../../nest_api';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';


export default function ItemDetails({ isTrader }) {
    const methods = useFormContext();
    if (!methods) {
        return null; // Or a loading spinner
    }
    const [categoryList, setCategoryList] = useState([])
    const [itemDetailsTotals, setItemDetailsTotals] = useState({
        totalBugs: 0,
        totalGross: 0,
        totalBuilty: 0,
        totalNett: 0,
        totalRatePerBug: 0,
        totalAmount: 0
    })
    const getCategoryList = async () => {
        try {

            if (isTrader) {
                const getCategoriesList = await getApiCall('/coconut-categories/getCategoriesList')
                const convetCategorie = getCategoriesList.map((item) => ({ ...item, name: item.c_name }))
                console.log('getCategoriesList', getCategoriesList)

                setCategoryList(convetCategorie)
            } else if (!isTrader) {

                const getPendingStock = await getApiCall('/stock-batch/getPendingStock')

                const categorySummaries = getPendingStock.reduce((acc, item, index) => {
                    const cid = item.category_id;
                    // If category not created, initialize it
                    if (!acc[cid]) {
                        acc[cid] = {
                            id: index + 1,
                            itemList: [],
                            category_id: cid,
                            name: item.category?.c_name || "",
                            totalQuantity: 0,
                            status: item.status,
                            totalAmount: 0,
                            itemCount: 0,
                            aveUnitPrice: 0,
                            t_id: item.stockTransaction?.id || null,
                        };
                    }
                    // Push item
                    acc[cid].itemList.push(item);
                    // Add totals
                    acc[cid].totalQuantity += acc[cid].status === "P" ? parseFloat(item.quantity || 0) : parseFloat(item.balance || 0);
                    acc[cid].totalAmount += parseFloat(item.tAmount || 0);
                    acc[cid].itemCount += 1;



                    // Calculate average AFTER totals updated
                    acc[cid].aveUnitPrice =
                        acc[cid].totalQuantity > 0
                            ? parseFloat(
                                (acc[cid].totalAmount / acc[cid].totalQuantity).toFixed(2)
                            )
                            : 0;

                    return acc;
                }, {});

                const finalResult = Object.values(categorySummaries).map((item, index) => ({
                    sno: index + 1, // Index dimulai dari 0, jadi ditambah 1
                    ...item
                }));;
                const categoryListRes = await getApiCall('/coconut-categories/getCategoriesList')
                const buyerPerson = categoryListRes.map((buyer) => ({
                    ...buyer, name: buyer.c_name
                }))
                setCategoryList(finalResult)
            }
        } catch (err) {
            console.log('error for getBuyerList :', err)
        }

    }

    useEffect(() => {
        getCategoryList()
    }, [])

    const { fields, append, remove } = useFieldArray({
        control: methods?.control,
        name: 'itemDetails',
    });

    useEffect(() => {
        if (methods) getCategoryList();
    }, [methods]);

    // 3. NOW you can return null if methods is missing
    if (!methods) {
        console.error("ItemDetails must be wrapped in FormProvider");
        return null;
    }

    // 4. Destructure after the check
    const { register, control, watch, setValue, getValues } = methods;
    const gridCenterStyles = {
        pt: '0 !important',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // You can even add responsive styles here
        textAlign: 'center'
    };


    const totalCalcution = () => {
        const getItemDetails = watch('itemDetails')
        const totalBugs = getItemDetails.reduce((s, r) => s + Number(r.bags), 0);
        const totalGross = getItemDetails.reduce((s, r) => s + Number(r.gross), 0);
        const totalBuilty = getItemDetails.reduce((s, r) => {
            console.log("r.unitPrice :", r.unitPrice)
            return s + Number(r.builtyCut)
        }, 0).toFixed(0);
        console.log('getItemDetails', getItemDetails)
        const totalRatePerBug = getItemDetails.reduce((s, r) => s + Number(r.perBagCast), 0);

        const totalAmount = getItemDetails.reduce((s, r) => s + Number(r.amount), 0).toFixed(0);
        setValue(`itemTotals.totalBugs`, totalBugs)
        setValue(`itemTotals.totalGross`, totalGross)
        setValue(`itemTotals.totalBuilty`, totalBuilty);
        setValue(`itemTotals.totalAmount`, totalAmount)

        setItemDetailsTotals({ ...itemDetailsTotals, totalBugs, totalGross, totalBuilty, totalRatePerBug, totalAmount })

    }
    const itemDetails = watch("itemDetails");
    const itemTotalCalcution = (index,) => {
        const unitPrice = Number(getValues(`itemDetails.${index}.unitPrice`)) || 0;
        const nett = Number(watch(`itemDetails.${index}.nett`)) || 0;
        let amount = 0;
        if (watch(`itemDetails.${index}.loose`) === 'loose') {
            amount = (unitPrice * nett).toFixed(0)
        } else {
            amount = (nett * Number(getValues(`itemDetails.${index}.ratePerBag`)) / 1000).toFixed(0)
        }
        console.log("itemTotalCalcution", index, watch(`itemDetails.${index}.loose`), nett, unitPrice, amount)
        setValue(`itemDetails.${index}.amount`, amount)

    }
    const [maxValues, setMaxValues] = useState([{ looseMax: null, bagMax: null }])
    const calculateBuiltyCut = (index) => {
        let builty = 0
        let nett = 0;
        let gross = 0;
        let bags = 0;
        let unitPrice = 0
        let balance = 0
        let totalQuantity = watch(`itemDetails.${index}.itemType.totalQuantity`) || 0
        if (getValues(`itemDetails.${index}.itemType`)) {
            unitPrice = Number(getValues(`itemDetails.${index}.itemType.aveUnitPrice`)) || 0;
        }
        if (watch(`itemDetails.${index}.loose`) === 'loose') {
            const looseQuantity = Number(getValues(`itemDetails.${index}.looseQuantity`)) || 0;
            setValue(`itemDetails.${index}.unitPrice`, unitPrice)
            gross = looseQuantity
            builty = isTrader ? (looseQuantity * 10 / 100) : (looseQuantity * 2 / 100);
            nett = gross - builty
            balance = totalQuantity - gross

        } else {
            const bharti = Number(getValues(`itemDetails.${index}.bharti`)) || 0;
            const looseQuantity = Number(getValues(`itemDetails.${index}.itemType.totalQuantity`)) || 0;
            const ratePerBag = unitPrice * 1000
            setValue(`itemDetails.${index}.ratePerBag`, ratePerBag)
            if (bharti && bharti !== 0) {
                bags = looseQuantity / bharti
                console.log("bag", Math.floor(bags))
                setValue(`itemDetails.${index}.bags`, Math.floor(bags));

                setMaxValues((prev) => prev.map((item, i) => i === index ? { ...item, bagMax: Math.floor(bags) } : item));
            } else {
                bags = Number(getValues(`itemDetails.${index}.bags`)).toFixed(0) || 0;
            }

            console.log("maxValues", maxValues);
            gross = bags * bharti
            builty = isTrader ? (bharti * bags * 10 / 100).toFixed(0) : (bharti * bags * 2 / 100).toFixed(0);
            nett = gross - builty
            balance = totalQuantity - gross

        }
        setValue(`itemDetails.${index}.gross`, gross);
        setValue(`itemDetails.${index}.balance`, balance);
        setValue(`itemDetails.${index}.nett`, nett);
        setValue(`itemDetails.${index}.builtyCut`, builty)
        itemTotalCalcution(index);
        totalCalcution();
    }


    return (
        <>
            <Grid sx={{ position: 'relative' }} display="flex" container spacing={2} alignItems="center" justifyContent="center" >
                <Grid item xs={12} sm={12}>
                    <Fieldset title="Item Details">
                        {fields.map((field, index) => (
                            <>
                                <Fieldset border={watch(`itemDetails.${index}.loose`) === 'loose' ? 'C' : watch(`itemDetails.${index}.loose`) === 'bharti' ? 'P' : null} title={(index + 1 + ") ") + (watch(`itemDetails.${index}.itemType`) ? watch(`itemDetails.${index}.itemType.name`).toUpperCase() + ' (' + watch(`itemDetails.${index}.itemType.totalQuantity`) + ')' : '')}>
                                    <Grid container spacing={2} alignItems="center" >
                                        <Grid
                                            item
                                            xs={12}
                                            sm={2}
                                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Centering logic
                                        >
                                            <Controller
                                                name={`itemDetails.${index}.loose`}
                                                control={control}
                                                rules={{ required: "Selection required" }}
                                                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                                                    <FormControl error={!!error} component="fieldset" fullWidth>
                                                        <Typography
                                                            sx={{
                                                                border: error ? '1px solid #d32f2f' : '1px solid #ccc',
                                                                borderRadius: 1,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                minHeight: '40px', // Ensures consistent height
                                                            }}
                                                            component="div"
                                                        >
                                                            <RadioGroup
                                                                row
                                                                ref={ref}
                                                                value={value ?? ""}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    onChange(val);

                                                                    const fieldNames = ['amount', 'bags', 'bharti', 'perBagCast', 'ratePerBag', 'unitPrice', 'looseQuantity', 'nett', 'builtyCut', 'gross', 'itemType'];
                                                                    fieldNames.forEach(field => setValue(`itemDetails.${index}.${field}`, null, { shouldValidate: true }));

                                                                    itemTotalCalcution(index);
                                                                    totalCalcution();
                                                                }}
                                                            >
                                                                {/* Different Colors Applied Below */}
                                                                <FormControlLabel
                                                                    value="loose"
                                                                    control={<Radio sx={{
                                                                        // 1. Force the Main Color (Unchecked)
                                                                        '& .MuiSvgIcon-root': {
                                                                            color: '#2e7d32 !important', // Use hex like '#f5cc00' or theme path
                                                                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                                                                        },
                                                                        // 2. Force the Main Color (Checked)
                                                                        '&.Mui-checked .MuiSvgIcon-root': {
                                                                            color: '#2e7d32 !important',
                                                                        }
                                                                    }} size="small" color="success" />} // Green
                                                                    label="Lose"
                                                                />
                                                                <FormControlLabel
                                                                    value="bharti"
                                                                    control={<Radio sx={{
                                                                        // 1. Force the Main Color (Unchecked)
                                                                        '& .MuiSvgIcon-root': {
                                                                            color: '#d21919 !important', // Use hex like '#f35d5d' or theme path
                                                                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                                                                        },
                                                                        // 2. Force the Main Color (Checked)
                                                                        '&.Mui-checked .MuiSvgIcon-root': {
                                                                            color: '#d21919 !important',
                                                                        }
                                                                    }} size="small" color="error" />} // Red
                                                                    label="Bharti"
                                                                />
                                                            </RadioGroup>
                                                        </Typography>
                                                        {error && <FormHelperText sx={{ textAlign: 'center' }}>{error.message}</FormHelperText>}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>


                                        {watch(`itemDetails.${index}.loose`) && <>
                                            <Grid key={field.id} item xs={12} sm={3}>
                                                {<Controller
                                                    name={`itemDetails.${index}.itemType`}
                                                    control={control}
                                                    defaultValue={null}
                                                    rules={{ required: 'Item Type is required' }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <Autocomplete
                                                            {...field}
                                                            options={categoryList}
                                                            // Disable option if it's selected in ANY other row
                                                            getOptionDisabled={(option) => {
                                                                const allSelectedTypes = watch('itemDetails') || [];
                                                                return allSelectedTypes.some((item, idx) =>
                                                                    idx !== index && item.itemType?.name === option.name
                                                                );
                                                            }}
                                                            getOptionLabel={(option) =>
                                                                option?.name?.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || ""
                                                            }
                                                            onChange={(_, value) => {
                                                                // 1. Update the field value
                                                                field.onChange(value);

                                                                // 2. Update dependent fields
                                                                const totalQuantity = value?.totalQuantity ?? null;
                                                                setValue(`itemDetails.${index}.looseQuantity`, totalQuantity);
                                                                setMaxValues((prev) => prev.map((item, i) => i === index ? { ...item, looseMax: totalQuantity } : item));


                                                                // 3. Trigger calculations
                                                                calculateBuiltyCut(index);
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    size="small"
                                                                    label="Item Type"
                                                                    error={!!error}
                                                                    helperText={error?.message}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                                }</Grid>


                                            <Grid item xs={12} sm={2}>
                                                {watch(`itemDetails.${index}.loose`) === 'bharti' ? <Box key={field.id} sx={{ display: 'flex' }}>
                                                    <Controller
                                                        {...field}
                                                        name={`itemDetails.${index}.bharti`}
                                                        control={control} // <--- Idi thappakunda undali
                                                        rules={{
                                                            required: "This field is required",
                                                            max: {
                                                                value: maxValues[index]?.looseMax || Infinity,
                                                                message: `Max Bharti allowed is ${maxValues[index]?.looseMax}`
                                                            },
                                                            min: {
                                                                value: 1,
                                                                message: "Cannot be negative"
                                                            }
                                                        }}
                                                        render={({ field: { onChange, value, ref } }) => ( // ref field lone untundi
                                                            <TextField
                                                                label="Bharti"
                                                                size="small"
                                                                fullWidth

                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderTopRightRadius: 0,
                                                                        borderBottomRightRadius: 0,
                                                                    },
                                                                }}
                                                                inputRef={ref}



                                                                value={value ?? ''}
                                                                onChange={(e) => {
                                                                    onChange(e);


                                                                    itemTotalCalcution(index)
                                                                    calculateBuiltyCut(index)
                                                                    totalCalcution()
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: !!value,
                                                                }}
                                                            />
                                                        )}
                                                    />


                                                    <Controller
                                                        {...field}
                                                        name={`itemDetails.${index}.bags`}
                                                        control={control}
                                                        rules={{
                                                            required: "This field is required",

                                                            max: {
                                                                value: maxValues[index]?.bagMax || Infinity,
                                                                message: `Max bags allowed is ${maxValues[index]?.bagMax}`
                                                            },
                                                            min: {
                                                                value: 1,
                                                                message: "Cannot be negative"
                                                            }
                                                        }}
                                                        render={({ field: { onChange, value, ref }, fieldState: { error } }) => ( // ref field lone untundi
                                                            <TextField
                                                                label="Bags"
                                                                size="small"
                                                                fullWidth
                                                                error={!!error}
                                                                helperText={error ? error.message : null}
                                                                sx={{
                                                                    marginLeft: '-1px', // Merges the borders
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderTopLeftRadius: 0,
                                                                        borderBottomLeftRadius: 0,
                                                                    },
                                                                }}
                                                                inputRef={ref} // register badulu inputRef use cheyali
                                                                value={value ?? ''} // null unte empty string chupisthundi
                                                                onChange={(e) => {
                                                                    onChange(e);
                                                                    const totalQuantity = Number(getValues(`itemDetails.${index}.itemType.totalQuantity`)) || 0;
                                                                    const bharti = getValues(`itemDetails.${index}.bharti`) || 0
                                                                    const gross = bharti * Number(e.target.value)
                                                                    const builty = isTrader ? gross * 10 / 100 : gross * 2 / 100
                                                                    const nett = gross - builty;
                                                                    const balance = totalQuantity - gross;
                                                                    console.log('bags onChange', bharti)
                                                                    setValue(`itemDetails.${index}.gross`, gross)
                                                                    setValue(`itemDetails.${index}.balance`, balance)

                                                                    setValue(`itemDetails.${index}.builtyCut`, builty)
                                                                    setValue(`itemDetails.${index}.nett`, nett)
                                                                    itemTotalCalcution(index)
                                                                    totalCalcution()

                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: !!value,
                                                                }}
                                                            />
                                                        )}
                                                    />



                                                </Box> : <div key={field.id} >
                                                    <Controller
                                                        {...field}
                                                        name={`itemDetails.${index}.looseQuantity`}
                                                        control={control}
                                                        rules={{
                                                            required: "This field is required",
                                                            max: {
                                                                value: maxValues[index]?.looseMax || Infinity,
                                                                message: `Max allowed is ${maxValues[index]?.looseMax}`
                                                            },
                                                            min: {
                                                                value: 0,
                                                                message: "Cannot be negative"
                                                            }
                                                        }}
                                                        render={({ field: { onChange, value, ref }, fieldState: { error } }) => ( // ref field lone untundi
                                                            <TextField
                                                                label="Loose"
                                                                size="small"
                                                                fullWidth
                                                                error={!!error}
                                                                helperText={error ? error.message : null}
                                                                inputRef={ref} // register badulu inputRef use cheyali
                                                                value={value ?? ''} // null unte empty string chupisthundi
                                                                onChange={(e) => {
                                                                    onChange(e);
                                                                    const totalQuantity = Number(getValues(`itemDetails.${index}.itemType.totalQuantity`)) || 0;
                                                                    const gross = Number(e.target.value)
                                                                    const builty = gross * 2 / 100
                                                                    const nett = gross - builty;
                                                                    const balance = totalQuantity - gross;
                                                                    setValue(`itemDetails.${index}.gross`, gross)
                                                                    setValue(`itemDetails.${index}.balance`, balance)
                                                                    setValue(`itemDetails.${index}.builtyCut`, builty)
                                                                    setValue(`itemDetails.${index}.nett`, nett)
                                                                    itemTotalCalcution(index)
                                                                    totalCalcution()
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: !!value,
                                                                }}
                                                            />
                                                        )}
                                                    /></div>}


                                            </Grid>

                                            <Grid item key={field.id} xs={12} sm={2}>
                                                <Controller
                                                    {...field}
                                                    name={`itemDetails.${index}.builtyCut`}
                                                    control={control} // <--- Idi thappakunda undali
                                                    render={({ field: { onChange, value, ref } }) => ( // ref field lone untundi
                                                        <TextField
                                                            label="Builty Cut"
                                                            size="small"
                                                            fullWidth
                                                            inputRef={ref} // register badulu inputRef use cheyali
                                                            value={value ?? ''} // null unte empty string chupisthundi
                                                            onChange={(e) => {
                                                                onChange(e)
                                                                const value = e.target.value
                                                                const gross = getValues(`itemDetails.${index}.gross`)
                                                                const nett = gross - value;
                                                                setValue(`itemDetails.${index}.nett`, nett);
                                                                const unitPrice = Number(getValues(`itemDetails.${index}.unitPrice`)) || 0
                                                                const perBagCast = unitPrice * 1000
                                                                setValue(`itemDetails.${index}.perBagCast`, perBagCast)
                                                                itemTotalCalcution(index)
                                                                totalCalcution()
                                                            }
                                                            }
                                                            slotProps={{
                                                                input: { readOnly: true },
                                                            }}
                                                            // Value unnapude label shrink avthundi
                                                            InputLabelProps={{
                                                                shrink: !!value,
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                {watch(`itemDetails.${index}.loose`) === 'bharti' ? <div key={field.id}>
                                                    <Controller
                                                        {...field}
                                                        name={`itemDetails.${index}.ratePerBag`}
                                                        control={control} // <--- Idi thappakunda undali
                                                        render={({ field: { onChange, value, ref } }) => ( // ref field lone untundi
                                                            <TextField
                                                                label="Rate Per Bag"
                                                                size="small"
                                                                fullWidth
                                                                inputRef={ref} // register badulu inputRef use cheyali
                                                                value={value ?? ''} // null unte empty string chupisthundi
                                                                onChange={(e) => {
                                                                    onChange(e)
                                                                    itemTotalCalcution(index)
                                                                    totalCalcution()
                                                                }}
                                                                slotProps={{
                                                                    input: { readOnly: true },
                                                                }}
                                                                // Value unnapude label shrink avthundi
                                                                InputLabelProps={{
                                                                    shrink: !!value,
                                                                }}
                                                            />
                                                        )}
                                                    /> </div> : <div key={field.id}> <Controller
                                                        {...field}
                                                        name={`itemDetails.${index}.unitPrice`}
                                                        control={control} // <--- Idi thappakunda undali
                                                        render={({ field: { onChange, value, ref } }) => ( // ref field lone untundi
                                                            <TextField
                                                                label="Unit Price"
                                                                size="small"
                                                                fullWidth
                                                                inputRef={ref} // register badulu inputRef use cheyali
                                                                value={value ?? ''} // null unte empty string chupisthundi
                                                                onChange={(e) => {
                                                                    onChange(e)
                                                                    itemTotalCalcution(index);
                                                                    totalCalcution()
                                                                }}
                                                                slotProps={{
                                                                    input: { readOnly: true },
                                                                }}

                                                                InputLabelProps={{
                                                                    shrink: !!value,
                                                                }}
                                                            />
                                                        )}
                                                    /></div>}
                                            </Grid>
                                            <Grid item xs={12} sm={1}>
                                                {fields.length !== 1 &&
                                                    <IconButton
                                                        disabled={fields.length === 1}
                                                        onClick={() => {
                                                            remove(index)
                                                            totalCalcution()
                                                        }}
                                                        aria-label="add"
                                                    >
                                                        <DoDisturbOnIcon color="error" fontSize='large' />
                                                    </IconButton>}
                                            </Grid></>}

                                    </Grid>

                                    <Divider
                                        sx={{
                                            mt: 1,               // margin-top: pushes the divider down from the content above
                                            // margin-bottom: creates space for the text below
                                            borderStyle: 'dashed',
                                            borderColor: '#ddd',
                                            borderWidth: '1px 0 0 0' // ensures only the top border is dashed
                                        }}
                                    />
                                    <Grid container alignItems="center" justifyContent="center">
                                        <Grid sx={gridCenterStyles} justifyContent="center" item xs={12} sm={2}>
                                            <Typography sx={{ pa: 0 }} key={field.id} variant="h6">Gross : {watch(`itemDetails.${index}.gross`) || 0}
                                            </Typography>
                                        </Grid>
                                        <Grid sx={gridCenterStyles} item xs={12} sm={2}>
                                            <Typography sx={{ pa: 0 }} key={field.id} variant="h6" >Nett : {watch(`itemDetails.${index}.nett`)?.toFixed(0) || 0}
                                            </Typography>
                                        </Grid>
                                        {!isTrader && <Grid sx={gridCenterStyles} item xs={12} sm={2}>
                                            <Typography sx={{ pa: 0 }} key={field.id} variant="h6" >Balance_Qnt : {watch(`itemDetails.${index}.balance`)?.toFixed(0) || 0}
                                            </Typography>
                                        </Grid>}

                                        <Grid sx={gridCenterStyles} item xs={12} sm={4}>
                                            <Typography sx={{ pt: 0 }} key={field.id} variant="h6" >Amount : {watch(`itemDetails.${index}.amount`) || 0}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Fieldset>
                                <br />
                            </>
                        ))}
                        <Divider />
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid sx={gridCenterStyles} justifyContent="center" item xs={12} sm={2}>
                                <Typography sx={{ pa: 0 }} variant="h6"> Total Bags :{itemDetailsTotals.totalBugs}
                                </Typography>
                            </Grid>
                            <Grid sx={gridCenterStyles} item xs={12} sm={2}>
                                <Typography sx={{ pa: 0 }} variant="h6" > Total Gross :{itemDetailsTotals.totalGross}
                                </Typography>
                            </Grid>
                            <Grid sx={gridCenterStyles} item xs={12} sm={3}>
                                <Typography sx={{ pa: 0 }} variant="h6" >Total Builty Cut : {itemDetailsTotals.totalBuilty}
                                </Typography>
                            </Grid>
                            <Grid sx={gridCenterStyles} item xs={12} sm={3}>
                                <Typography sx={{ pt: 0 }} variant="h6" > Total Amount :{itemDetailsTotals.totalAmount}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                    </Fieldset>
                    <br />

                </Grid>
                <Typography gutterBottom sx={{ px: 3, position: 'absolute', top: 5, right: -40 }} component="div">
                    <IconButton
                        color="secondary"
                        onClick={() => {
                            const newValue = { looseMax: null, bagMax: null }
                            setMaxValues((prevItems) => [...prevItems, newValue])

                            append({ type: '', number: '', isDefault: false })
                        }}
                        aria-label="add"
                    >
                        <AddCircleIcon fontSize='large' />
                    </IconButton>
                </Typography>
            </Grid>
        </>
    )


}