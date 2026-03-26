import React, { useState, useEffect } from 'react';
import Fieldset from '../Fieldset/Fieldset';
import { useForm, FormProvider, useFormContext, useFieldArray, Controller } from 'react-hook-form';
import ItemDetails from './ItemDetails';
import DataGridComponent from '../DataGrid/DataGridComponent';
import DatePickerComponent from '../DatePicker/DatePicker';
import { getApiCall, } from '../../nest_api';
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



export default function BulkPurchaseAndBuyForm({ isTrader, traderDetails = false }) {


    const [buyerList, setBuyerList] = useState([])
    const getBuyersList = async () => {
        try {
            if (isTrader) {
                const traderList = await getApiCall('/trader/allTraders')
                const convertData = traderList.map((item) => ({ id: item.id, name: item.person.name, village: item.person.village }))
                console.log("convertData", convertData)
                setBuyerList(convertData)

            } else if (!isTrader) {
                const buyersListRes = await getApiCall('/buyer/allBuyers')
                const buyerPerson = buyersListRes.map((buyer) => ({
                    ...buyer, name: buyer.person.name, village: buyer.person.village
                }))
                setBuyerList(buyerPerson)
            }

        } catch (err) {
            console.log('error for getBuyerList :', err)
        }

    }

    useEffect(() => {
        getBuyersList()

    }, [])



    const {
        register,
        formState: { errors },
        control,
        watch,
    } = useFormContext();

    return (
        <>
            <Fieldset title={isTrader ? 'Trader Details' : "Buyer Details"}>
                <Grid container spacing={4} alignItems="center" justifyContent="center">

                    <Grid item xs={12} md={4}>
                        <DatePickerComponent
                            label="Payment Date"
                            controlForm1={control}
                            errorsForm1={errors}
                        />
                    </Grid>
                    {!traderDetails && <Grid item xs={12} sm={6}>
                        <Controller
                            name={isTrader ? 'trader' : "buyer"}
                            control={control}
                            defaultValue={null}
                            rules={{ required: isTrader ? "Trader is required" : "Buyer is required" }}
                            render={({ field, fieldState: { error } }) => (
                                <Autocomplete
                                    options={buyerList}
                                    getOptionLabel={(option) => {
                                        const toTitleCase = (str) =>
                                            str?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

                                        return `${toTitleCase(option?.name)} - ${toTitleCase(option?.village)}`;
                                    }}
                                    onChange={(_, value) => field.onChange(value)}
                                    value={field.value}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            label={isTrader ? 'Trader' : "Buyer"}
                                            error={!!error}
                                            helperText={error ? error.message : ''}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>}
                </Grid>
            </Fieldset>
            <br />
            <ItemDetails isTrader={isTrader} />
        </>
    );
}