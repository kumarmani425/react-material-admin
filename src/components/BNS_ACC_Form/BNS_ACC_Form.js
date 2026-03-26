// File: src/components/CreateForm/CreateForm.js
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
    AppBar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams, Navigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { useForm, FormProvider, useFormContext, useFieldArray, Controller } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationContext from "../../store/alert-context";
import { AddCircleOutline, Person } from '@mui/icons-material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent';
import { AccountBalance, Store, ContactPhone } from '@mui/icons-material'
import {
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@mui/material';
import { getApiCall, postApiCall } from '../../nest_api';
import DetailsPageHeader from '../../components/DetailsPageHeader/DetailsPageHeader';
import CheateVillagePop from '../../components/CheateVillagePop/CheateVillagePop';
import { getApiCallWithParams } from '../../nest_api';
import { useContext } from "react";
import { red } from '@mui/material/colors';

import CheckCircle from '@mui/icons-material/CheckCircle';

import { useSearchParams, useNavigate } from "react-router-dom";
import Fieldset from '../Fieldset/Fieldset';

import {
    Avatar, Divider, Chip, Container
} from '@mui/material';
import { Email, Phone, Home, Work, Badge } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateForumPop from '../Forum/CreateForumPop/CreateForumPop';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { vi } from 'date-fns/locale';

const steps = ['Personal Info', 'Bank Details', 'Review'];



const loginUser = JSON.parse(localStorage.getItem('user'))
const PHONE_TYPES = [
    { value: 'home', label: 'home' },
    { value: 'Work', label: 'Work' },
    { value: 'Mobile', label: 'Mobile' },
    { value: 'Other', label: 'Other' },
];




const upiList = [
    { "name": "Google Pay", "package": "com.google.android.apps.nbu.paisa.user", "priority": 1 },
    { "name": "PhonePe", "package": "com.phonepe.app", "priority": 2 }
]
function PersonalInfo() {
    const [searchParams] = useSearchParams();
    const [rolesList, setRolesList] = useState({});
    const [addForum, setAddForum] = useState(false);
    const [forumList, setForumList] = useState({})


    const isEdit = searchParams.get("isEdit");
    const type = searchParams.get("type");

    const fetchAllForumList = async () => {
        try {
            const forumList = await getApiCall('forum/allForums')
            setForumList(forumList)
        } catch (err) {
            console.log('fetchAllFoumList err :', err)
        }

    }


    useEffect(() => {
        const onLoadService = async () => {
            try {

                fetchAllForumList()
                console.log('forumList', forumList);
                const userRolesList = await getApiCall('roles/allRoles')
                setRolesList(userRolesList)
                console.log('userRolesList', userRolesList)
            } catch (err) {
                console.log('err', err)

            }
        }
        onLoadService();
    }, [])

    const {
        register,
        formState: { errors },
        control,
        watch,
    } = useFormContext();
    const closeForumPop = () => {
        setAddForum(false)
        fetchAllForumList()
    }

    return (
        <>
            <CreateForumPop open={addForum} onClose={closeForumPop} />



            <Fieldset title="Personal Info">
                <Grid container justifyContent="center" spacing={4}>
                    <Grid item xs={12} sm={5}>
                        <TextField
                            label="Name"
                            size='small'
                            {...register('name', { required: 'Name is required' })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                        <TextField
                            label="Father Name"
                            size='small'
                            {...register('fName', { required: 'Father name is required' })}
                            error={!!errors.fName}
                            helperText={errors.fName?.message}
                            fullWidth
                        />
                    </Grid>


                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Aadhar"
                            size="small"
                            {...register('aadhar', {
                                maxLength: { value: 12, message: 'Aadhar must be at most 12 digits' },

                            })}
                            error={!!errors.aadhar}
                            helperText={errors.aadhar?.message}
                            inputProps={{ maxLength: 12, inputMode: 'numeric', pattern: '\\d*' }}
                            fullWidth
                        />

                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Email"
                            {...register('email', {

                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Email is invalid',
                                },
                            })}
                            size='small'
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            fullWidth

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Village Name"
                            {...register('village', {
                                required: 'village is required',

                            })}
                            size='small'
                            error={!!errors.village}
                            helperText={errors.village?.message}
                            fullWidth

                        />
                    </Grid>

                </Grid>

                <br />
                <Grid container justifyContent="center" spacing={4}>
                    <Grid item xs={12} sm={10}>
                        <TextField
                            label="Informantion"
                            {...register('info')}
                            multiline
                            minRows={1}     // Minimum number of rows to display
                            maxRows={6}     // Maximum rows before scrolling begins
                            fullWidth       // Makes it span the full width of its container
                            variant="outlined"
                        />
                    </Grid></Grid>
                <br />
                <Typography gutterBottom sx={{ px: 3 }} variant="h6" component="div">
                    Phone Numbers
                    <Divider sx={{ px: 5 }} />
                </Typography>


                <br />
                <PhoneNumbars />

            </Fieldset>

        </>

    );
}
function ReviewBlockUi({ userData }) {

    const data = userData

    console.log("primaryPhone in review", data);


    return (


        <Grid container spacing={3}>

            {/* Personal Details Section */}
            <Grid item xs={12} md={6}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person color="primary" /> Personal Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1"><strong>Name:</strong> {data?.name.toUpperCase()}</Typography>
                        <Typography variant="body1"><strong>Father's Name:</strong> {data?.fName}</Typography>
                        <Typography variant="body1"><strong>Aadhar:</strong> {data.aadhar}</Typography>
                        <Typography variant="body1"><strong>Email:</strong> {data.email}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Forum Section */}
            {data?.forumName?.name && <Grid item xs={12} md={6}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Store color="primary" /> Business Forum
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="h5" color="secondary">{data?.forumName?.name}</Typography>
                        <Typography variant="body2" color="textSecondary">Location: {data?.forumName?.location}</Typography>
                        <Chip
                            label={data?.forumName?.status}
                            color={data?.forumName?.status === 'active' ? 'success' : 'default'}
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </CardContent>
                </Card>
            </Grid>}


            {/* Bank Details Section */}
            {data.bankDetails.length > 0 && <Grid item xs={12}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccountBalance color="primary" /> Banking & UPI
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {data.bankDetails.map((bank, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, position: 'relative' }}>
                                        {bank.isDefault && <CheckCircle
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                color: 'success.main' // Uses MUI's standard green
                                            }}
                                        />}
                                        <Typography variant="subtitle1"><strong>{bank?.bankName?.name}</strong></Typography>
                                        <Typography variant="body2"><strong>A/C Holder Name :</strong> {bank?.holderName}</Typography>
                                        <Typography variant="body2"><strong>A/C:</strong> {bank?.acNumber}</Typography>
                                        <Typography variant="body2"><strong>IFSC: </strong>{bank?.ifsc}</Typography>
                                        <Typography variant="body2"><strong>Branch: </strong>{bank?.branch}</Typography>
                                        <Chip label={bank?.acType
                                        } size="small" sx={{ mt: 1, backgroundColor: '#e1f5fe' }} />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>}

            {/* Contact & Additional UPI Section */}
            <Grid item xs={6}>
                <Card elevation={3}>
                    <CardContent>

                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ContactPhone color="primary" /> Contact                      </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {data.phoneNumbers.map((upi, index) => (
                                <Grid item xs={12} sm={12} key={index}>

                                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, position: 'relative' }}>
                                        {upi.isDefault && <CheckCircle
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                color: 'success.main' // Uses MUI's standard green
                                            }}
                                        />}
                                        <Typography variant="body2"><strong>Phone Number </strong>
                                            : {upi?.number
                                            }</Typography>

                                        <Typography variant="body2"><strong>Type:</strong> {upi?.type.value}</Typography>

                                    </Box>
                                </Grid>
                            ))}

                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            {data.upiDetails?.length > 0 && <Grid item xs={6}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccountBalanceWalletIcon color="primary" /> UPI Details                </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {data.upiDetails.map((upi, index) => (
                                <Grid item xs={12} sm={12} key={index}>
                                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, position: 'relative' }}>
                                        {upi.isDefault && <CheckCircle
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                color: 'success.main' // Uses MUI's standard green
                                            }}
                                        />}
                                        <Typography variant="body2"><strong>UPI Number
                                            : </strong>{upi?.upiNumber
                                            }</Typography>

                                        <Typography variant="body2"><strong>UPI Name:</strong> {upi?.upiName}</Typography>
                                        <Chip label={upi?.upiType?.name
                                        } size="small" sx={{ mt: 1, backgroundColor: '#e1f5fe' }} />
                                    </Box>
                                </Grid>
                            ))}

                        </Grid>
                    </CardContent>
                </Card>
            </Grid>}

        </Grid>


    );
};

function PhoneNumbars() {
    const { register, control, watch, formState: { errors }, setValue } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'phoneNumbers',
    });


    return (

        <Box >
            <Grid container spacing={4} alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={10}>
                    <RadioGroup>
                        {fields.map((field, index) => (
                            <Fieldset title={`Phone ${index + 1}`} key={field.id} sx={{ mb: 2 }}>
                                <Grid container spacing={2} key={field.id} sx={{ mb: 1 }}>
                                    <Grid item xs={12} sm={2}>
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    checked={!!watch(`phoneNumbers.${index}.isDefault`)}
                                                    onChange={() => {
                                                        // reset all to false
                                                        fields.forEach((_, i) => setValue(`phoneNumbers.${i}.isDefault`, false));
                                                        // set only current index to true
                                                        setValue(`phoneNumbers.${index}.isDefault`, true);
                                                    }}
                                                />
                                            }
                                            label="Default"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Controller
                                            name={`phoneNumbers.${index}.type`}
                                            control={control}
                                            defaultValue={null}
                                            rules={{ required: 'Type is required' }}
                                            render={({ field, fieldState: { error } }) => (
                                                <Autocomplete
                                                    options={PHONE_TYPES}
                                                    getOptionLabel={(option) => option?.label}
                                                    onChange={(_, value) => field.onChange(value)}
                                                    value={field.value}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            label="Type"
                                                            error={!!error}
                                                            helperText={error ? error.message : ''}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            label="Number"
                                            size="small"
                                            type="number"
                                            {...register(`phoneNumbers.${index}.number`, { required: 'Number is required' })}
                                            fullWidth
                                            error={!!errors.phoneNumbers?.[index]?.number}
                                            helperText={errors.phoneNumbers?.[index]?.number?.message}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={1}>
                                        {fields.length === index + 1 && (
                                            <IconButton
                                                color="secondary"
                                                onClick={() => append({ type: '', number: '', isDefault: false })}
                                                aria-label="add"
                                            >
                                                <AddCircleOutline />
                                            </IconButton>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} sm={1}>
                                        <IconButton
                                            aria-label="delete"
                                            sx={{ color: 'red' }}
                                            disabled={fields.length === 1}
                                            onClick={() => remove(index)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Fieldset>

                        ))}
                    </RadioGroup>
                </Grid></Grid>
        </Box>
    );
}

function BankDetails() {
    const [villageList, setVillageList] = useState([]);
    const [addVillage, setAddVillage] = useState(false);

    const [banksList, setBanksList] = useState([])

    const getBankList = async () => {
        const res = await getApiCall('banks/allBanksList')
        setBanksList(res)
        console.log('banks LIst', res)
    }
    useEffect(() => {
        getBankList()
    }, [])

    const { register, control, watch, formState: { errors }, setValue } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'bankDetails',
    });

    const { fields: upiDetails, append: upiAppend, remove: upiRemove } = useFieldArray({
        control,
        name: 'upiDetails',
    });


    return (
        <>
            <Fieldset title="Bank Details">

                <Box >

                    <RadioGroup >
                        {fields.map((field, index) => (
                            <>
                                <br></br>
                                <Grid container spacing={2} sx={{ px: 2, pb: 2 }} key={field.id}  >
                                    <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ px: 1 }}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography gutterBottom variant="h6" >
                                                <FormControlLabel
                                                    value={String(index)}
                                                    control={
                                                        <Radio
                                                            checked={!!watch(`bankDetails.${index}.isDefault`)}
                                                            onChange={() => {
                                                                fields.forEach((_, i) => setValue(`bankDetails.${i}.isDefault`, false));
                                                                // set only current index to true
                                                                setValue(`bankDetails.${index}.isDefault`, true);
                                                            }}
                                                        />
                                                    }

                                                /> Bank {index + 1}

                                                {!watch(`bankDetails.${index}.isDefault`) && (
                                                    <IconButton aria-label="delete" sx={{ color: 'red', float: 'right' }} onClick={() => remove(index)} color="error">
                                                        <DeleteIcon color={'red'} />
                                                    </IconButton>
                                                )}
                                            </Typography>
                                            <Divider />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Controller
                                                name={`bankDetails.${index}.bankName`}
                                                control={control}
                                                defaultValue={null}
                                                rules={{ required: 'Bank Name is required' }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <Autocomplete
                                                        options={banksList}
                                                        getOptionLabel={(option) => option?.name}
                                                        onChange={(_, value) => field.onChange(value)}
                                                        value={field.value}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size='small'
                                                                label="Bank Name"
                                                                error={!!error}
                                                                helperText={error ? error.message : ''}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="AC Holder Name"
                                                size='small'
                                                type="text"
                                                {...register(`bankDetails.${index}.holderName`, { required: 'AC Holder Name is required' })}
                                                fullWidth
                                                error={!!errors.bankDetails?.[index]?.holderName}
                                                helperText={errors.bankDetails?.[index]?.holderName?.message}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="Account Number"
                                                size='small'
                                                type="text"
                                                {...register(`bankDetails.${index}.acNumber`, { required: 'Account Number is required' })}
                                                fullWidth
                                                error={!!errors.bankDetails?.[index]?.acNumber}
                                                helperText={errors.bankDetails?.[index]?.acNumber?.message}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="IFSC Code"
                                                size='small'
                                                type="text"
                                                {...register(`bankDetails.${index}.ifsc`, { required: 'IFSC Code is required' })}
                                                fullWidth
                                                error={!!errors.bankDetails?.[index]?.ifsc}
                                                helperText={errors.bankDetails?.[index]?.ifsc?.message}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="Branch"
                                                size='small'
                                                type="text"
                                                {...register(`bankDetails.${index}.branch`, { required: 'branch is required' })}
                                                fullWidth
                                                error={!!errors.bankDetails?.[index]?.branch}
                                                helperText={errors.bankDetails?.[index]?.branch?.message}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="Account Type"
                                                size='small'
                                                type="text"
                                                {...register(`bankDetails.${index}.acType`, { required: 'Account Type is required' })}
                                                fullWidth
                                                error={!!errors.bankDetails?.[index]?.acType}
                                                helperText={errors.bankDetails?.[index]?.acType?.message}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        ))}
                    </RadioGroup>
                    <Grid item xs={12} sm={12} sx={{ textAlign: 'right' }}>

                        <Button color='success' variant="contained" onClick={() => append(
                            {
                                holderName: '',
                                bankName: '',
                                ifsc: '',
                                branch: '',
                                acNumber: "",
                                acType: "",
                                isDefault: fields.length > 0 ? false : true
                            })}
                            startIcon={<AddCircleOutline color={'red'} />}>
                            Add bank
                        </Button>

                    </Grid>
                </Box>
            </Fieldset>
            <br></br>
            <Fieldset title="UPI Details">
                <Box >

                    <RadioGroup >
                        {upiDetails.map((field, index) => (
                            <>
                                <br></br>
                                <Grid container spacing={2} sx={{ px: 2, pb: 2 }} key={field.id}  >
                                    <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ px: 1 }}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography gutterBottom variant="h6" >
                                                <FormControlLabel
                                                    value={String(index)}
                                                    control={
                                                        <Radio
                                                            checked={!!watch(`upiDetails.${index}.isDefault`)}
                                                            onChange={() => {
                                                                // reset all to false
                                                                upiDetails.forEach((_, i) => setValue(`upiDetails.${i}.isDefault`, false));
                                                                // set only current index to true
                                                                setValue(`upiDetails.${index}.isDefault`, true);
                                                            }}
                                                        />
                                                    }

                                                /> UPI {index + 1}

                                                {!watch(`upiDetails.${index}.isDefault`) && (
                                                    <IconButton aria-label="delete" sx={{ color: 'red', float: 'right' }} onClick={() => upiRemove(index)} color="error">
                                                        <DeleteIcon color={'red'} />
                                                    </IconButton>
                                                )}
                                            </Typography>
                                            <Divider />
                                        </Grid>

                                        <Grid item xs={12} sm={3}>
                                            <Controller
                                                name={`upiDetails.${index}.upiType`}
                                                control={control}
                                                defaultValue={null}
                                                rules={{ required: 'UPI Type is required' }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <Autocomplete
                                                        options={upiList}
                                                        getOptionLabel={(option) => option?.name}
                                                        onChange={(_, value) => field.onChange(value)}
                                                        value={field.value}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size='small'
                                                                label="UPI Type"
                                                                error={!!error}
                                                                helperText={error ? error.message : ''}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                label="Phone Number"
                                                size='small'
                                                type="number"
                                                {...register(`upiDetails.${index}.upiNumber`, { required: 'upiNumber is required' })}
                                                fullWidth
                                                error={!!errors.upiDetils?.[index]?.upiNumber}
                                                helperText={errors.upiDetils?.[index]?.upiNumber?.message}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <TextField
                                                label="Name"
                                                size='small'
                                                type="text"
                                                {...register(`upiDetails.${index}.upiName`, { required: 'Upi Name is required' })}
                                                fullWidth
                                                error={!!errors.upiDetils?.[index]?.upiName}
                                                helperText={errors.upiDetils?.[index]?.upiName?.message}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </>

                        ))}
                    </RadioGroup>
                    <Grid item xs={12} sm={12} sx={{ textAlign: 'right' }}>

                        <Button color='success' variant="contained" onClick={() => upiAppend({ upiNumber: '', upiName: '', upiType: {}, isDefault: upiDetails.length > 0 ? false : true })} startIcon={<AddCircleOutline color={'red'} />}>
                            Add UPI
                        </Button>

                    </Grid>
                </Box>
            </Fieldset>
        </>

    );
}

function Review({ data }) {


    console.log("review data", data)
    return (
        <Box>
            <ReviewBlockUi userData={data} />
        </Box>
    );
}

export default function BNS_ACC_Form() {

    const alertCtx = useContext(NotificationContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const name = searchParams.get("name");
    const isEdit = searchParams.get("isEdit");
    const id = searchParams.get("pId");
    const [bnsPerson, setBnsPerson] = useState(null);

    const personId = searchParams.get("personId");
    const [banksList, setBanksList] = useState([])

    const getBankList = async () => {
        console.log("fetching bank list")
        const res = await getApiCall('banks/allBanksList')
        setBanksList(res)
        console.log('banks LIst 01', res)
    }
    useEffect(() => {
        getBankList();
    }, [])


    const [activeStep, setActiveStep] = useState(0);
    let methods = useForm({
        defaultValues: {
            name: name || null,
            fName: 'suryanarayana',
            aadhar: null,
            email: null,
            phoneNumbers: [{ id: null, type: PHONE_TYPES[0], number: '9491716511', isDefault: true }],
            upiDetails: [{
                id: null,
                "upiNumber": "6464456",
                "upiName": "dfsafads",
                "upiType": {
                    "name": "PhonePe",
                    "package": "com.phonepe.app",
                    "priority": 2
                },
                "isDefault": true
            }],
        },
        mode: 'onTouched',
    });
    const personTemMaping = (res) => {
        if (res && typeof methods.reset === 'function') {
            console.log("API response for personTemMaping", banksList);

            const formData = {
                id: res.id || '',
                name: res.name || '',
                fName: res.fName || '',
                aadhar: res.aadhar || null,
                village: res.village || "",
                email: res.email || '',
                info: res.info || '',



                // map phones to form shape: { type: PHONE_TYPES[*], number, isDefault }
                phoneNumbers: (res.phones).map((p) => ({
                    type: (PHONE_TYPES.find((t) => t.value === p.type) || { value: p.type, label: p.type }),
                    number: p.number || p.no || '',
                    isDefault: !!(p.isPrimary || p.isDefault),
                })),


                // map bankDetailses to form shape: { village: {id, villageName} | null, landmark, street, details, type, isDefault }
                bankDetails: (res.BankDetailsList || []).map((a) => {
                    console.log('mapping bank', banksList);

                    return {

                        bankName: banksList.find((b) => +b.id === +a.b_name_id),
                        acType: a.ac_type || '',
                        ifsc: a.ifsc || '',
                        acNumber: a.ac_number || '',
                        branch: a.branch || '',
                        holderName: a.holder || '',
                        isDefault: !!(a.isPrimary || a.isDefault),
                    }
                }),
                upiDetails: (res.UpiDetails || []).map((u) => ({

                    upiNumber: u.upi_number || '',
                    upiName: u.name || '',
                    upiType: upiList.find((uType) => uType.name === u.upi_type) || null,
                    isDefault: !!(u.isPrimary || u.isDefault),
                })),
            };

            // Ensure at least one phone/BankDetails entry exists to avoid empty arrays in the UI
            if (!formData.phoneNumbers || formData.phoneNumbers.length === 0) {
                formData.phoneNumbers = [{ type: PHONE_TYPES[0], number: '', isDefault: true }];
            }
            if (!formData.bankDetails || formData.bankDetails.length === 0) {
                formData.bankDetails = [
                    { village: '', landmark: '', street: '', details: [], isDefault: true },
                ];
            }
            methods.reset(formData);
        }
    }

    useEffect(() => {

        const fetchBnsPerson = async () => {
            if (!id) return;
            try {
                const res = await getApiCallWithParams(`/bns-person/findBnsPerson/${id}`);
                setBnsPerson(res);
                personTemMaping(res);
            } catch (err) {
                console.error('fetchBnsPerson error', err);
            }

        };

        if (isEdit) {
            fetchBnsPerson();
        }

    }, [type, id, banksList]);


    const { handleSubmit, trigger, getValues, reset } = methods;

    const stepFields = [
        ['name', 'sName', 'fName', 'religion', 'occupation', 'phoneNumbers', 'village'],
        ['bankDetails'],
    ];



    const validationCheck = async () => {
        if (getValues()?.bankDetails?.length > 0) {
            console.log('banks', getValues())
        }
    };

    const handleNext = async () => {
        validationCheck()
        const valid = await trigger(stepFields[activeStep]);
        console.log("valid", stepFields[activeStep])
        if (valid) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };
    const successAction = (res) => {

        console.log("res after create person", res);
        alertCtx.setNotification({ message: 'Person created successfully', type: 'success' })
        reset({
            state: "",
            district: "",
            mandal: null,
            villageName: "",
            pincode: "",
            phoneNumbers: [{ type: PHONE_TYPES[0], number: '', isDefault: true }],
            bankDetails: [{
                village: '',
                landmark: '',
                street: '',
                details: [],
                isDefault: true
            }],
            name: '',
        });
        if (type) {
            navigate(`/app/${type}/${loginUser.forum_id}/${res[type].id}`);
        }
        if (isEdit) {
            navigate(`/app/${type}/${loginUser.forum_id}/${res.id}`);
        } else {
            if (type === 'user') {
                navigate(`/app/${type}/${loginUser.forum_id}/${res.navigateId}`);
            } else if (type === 'dipositor') {
                navigate(`/app/${type}/${loginUser.forum_id}/${res.navigateId}`);
            }
        }
    }
    const failedAction = (error) => {
        const message = error.response?.data?.message || error.message;
        if (message) {
            alertCtx.setNotification({ message: message, type: 'error' })
        } else {
            alertCtx.setNotification({ message: 'An unknown error occurred fgfdg', type: 'error' })
        }
        setActiveStep((prev) => 0);
    }
    const onSubmit = async (data) => {
        console.log("form data before submit", data)
        const phoneNoData = data.phoneNumbers.map((phone) => ({
            type: phone.type?.value,
            number: phone.number,
            isPrimary: phone.isDefault
        })
        );

        const bankDetailsData = data.bankDetails.map((bank) => ({
            id: bank.id,
            b_name_id: bank.bankName?.id,
            ac_type: bank.acType,
            branch: bank.branch,
            ifsc: bank.ifsc,
            ac_number: bank.acNumber,
            holder: bank.holderName,
            isPrimary: bank.isDefault

        }));
        const upiDetailsData = data.upiDetails.map((upi) => ({
            id: upi.id,
            upi_number: upi.upiNumber,
            name: upi.upiName,
            upi_type: upi.upiType?.name,
            isPrimary: upi.isDefault
        }));
        console.log("upiDetailsData", type)
        data.phoneNumbers = phoneNoData;
        const postData = {}
        postData.name = data.name;
        postData.fName = data.fName;
        postData.aadhar = data.aadhar && data.aadhar.length > 1 ? data.aadhar : null || null;
        postData.email = data.email && data.email.length > 1 ? data.email : null || null;;
        postData.village = data.village;
        postData.phones = data.phoneNumbers
        postData.bankDetailses = bankDetailsData;
        postData.info = data.info
        postData.type = type;
        postData.forum_id = +loginUser.forum_id || 0;
        postData.upiDetails = upiDetailsData
        console.log("postData before submit", postData);

        try {
            if (!isEdit) {
                postData.id = id;
                await postApiCall('/bns-person/creatBNSPerson', postData).then((res) => {
                    successAction(res);
                }).catch((error) => {
                    failedAction(error);
                });
            } else {
                postData.navigateId = id
                console.log("postData for edit", data);
                await postApiCall(`/bns-person/updateBnsPerson/${bnsPerson.id}`, postData).then((res) => {
                    successAction(res);
                }).catch((error) => {
                    failedAction(error);
                });
                console.log("postData for edit", postData);
                console.log("id for edit", type)
            }
        } catch (e) {
            const message = e.response?.data?.message || e.message;
            if (message) {
                alertCtx.setNotification({ message: message, type: 'error' })
            } else {
                alertCtx.setNotification({ message: 'An unknown error occurred', type: 'error' })
            }
            setActiveStep((prev) => 0);
        }
    };
    const title = "trader"
    return (
        <FormProvider {...methods}>
            <AppBar position="static" sx={{ textTransform: "capitalize", borderRadius: '8px 8px 0 0' }}>
                <Toolbar variant="dense">
                    <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        Create  {title || 'Seller'}
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
                                            {activeStep === 0 && <PersonalInfo />}
                                            {activeStep === 1 && <BankDetails />}

                                            {activeStep === 2 && <Review data={getValues()} />}
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
