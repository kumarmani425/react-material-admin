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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams, Navigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { useForm, FormProvider, useFormContext, useFieldArray, Controller } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationContext from "../../store/alert-context";
import { AddCircleOutline, Person } from '@mui/icons-material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

import { useSearchParams, useNavigate } from "react-router-dom";
import Fieldset from './Fieldset';

import {
  Avatar, Divider, Chip, Container
} from '@mui/material';
import { Email, Phone, Home, Work, Badge } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateForumPop from '../Forum/CreateForumPop/CreateForumPop';


const steps = ['Personal Info', 'Contact Details', 'Address', 'Review'];

const RELIGION_OPTIONS = [
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Muslim', label: 'Muslim' },
  { value: 'Christian', label: 'Christian' },
  { value: 'Sikh', label: 'Sikh' },
];

const loginUser = JSON.parse(localStorage.getItem('user'))
const PHONE_TYPES = [
  { value: 'home', label: 'home' },
  { value: 'Work', label: 'Work' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Other', label: 'Other' },
];

const ADDRESS_TYPES = [
  { value: 'home', label: 'home' },
  { value: 'work', label: 'work' },
  { value: 'permanent', label: 'permanent' },
  { value: 'current', label: 'current' },
  { value: 'temporary', label: 'temporary' },
  { value: 'office', label: 'office' },
];

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
        const userRolesList = await getApiCall('userRoles/allUserRoles')
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
      {type === 'trader' && <div> <Fieldset title="Forum Details" >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="forumName"
              control={control}
              size='small'
              rules={{ required: 'Forum Name  is required' }}
              render={({ field }) => (
                <Autocomplete
                  disablePortal
                  options={forumList}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  value={field.value || null}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Forum Name"
                      size='small'
                      error={!!errors.forumName}
                      helperText={errors.forumName?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="outlined" onClick={() => setAddForum(true)} startIcon={<AddIcon />} href="#outlined-buttons">Forum
            </Button>
          </Grid>
        </Grid>
      </Fieldset>
        <br /></div>}
      {type === 'user' && <div>
        <Fieldset title="User Creation" >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Controller
                name="forumName"
                control={control}
                size='small'
                rules={{ required: 'Forum Name  is required' }}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    options={forumList}
                    getOptionLabel={(option) => option.name}
                    fullWidth
                    value={field.value || null}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Forum Name"
                        size='small'
                        error={!!errors.forumName}
                        helperText={errors.forumName?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="User ID"
                size="small"
                {...register('userId', {
                  required: 'User ID is required',
                  validate: async (value) => {
                    if (!value) return true;
                    try {
                      const res = await getApiCallWithParams(`/users/userId/${encodeURIComponent(value)}`);
                      if (res && (res.exists === true || res.user)) {
                        return 'User ID already Used';
                      }
                      return true;
                    } catch (err) {
                      return 'Error validating user ID';
                    }
                  },
                })}
                error={!!errors.userId}
                helperText={errors.userId?.message}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Password"
                type="password"
                size="small"
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Confirm Password"
                size="small"
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="userRole"
                control={control}
                size='small'
                rules={{ required: 'User Role is required' }}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    options={rolesList}
                    getOptionLabel={(option) => option.name}
                    fullWidth
                    value={field.value || null}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="User Role"
                        size='small'
                        error={!!errors.userRole}
                        helperText={errors.userRole?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Fieldset>
        <br />
      </div>}

      <Fieldset title="Personal Info">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Name"
              size='small'
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Sur Name"
              size='small'
              {...register('sName', { required: 'Sur name is required' })}
              error={!!errors.sName}
              helperText={errors.sName?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Father Name"
              size='small'
              {...register('fName', { required: 'Father name is required' })}
              error={!!errors.fName}
              helperText={errors.fName?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Age"
              size='small'
              {...register('age', { required: 'Age is required' })}
              error={!!errors.age}
              helperText={errors.age?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Aadhar"
              size="small"
              {...register('aadhar', {
                required: 'Aadhar Number is required',
                maxLength: { value: 12, message: 'Aadhar must be at most 12 digits' },
                pattern: { value: /^\d*$/, message: 'Only digits allowed' },
                validate: async (value) => {
                  if (isEdit) return true;
                  if (!value) return true;

                  try {
                    const res = await getApiCallWithParams(`person/aadharValidation/${encodeURIComponent(value)}`);
                    if (res && (res.exists === true)) {
                      return 'Aadhar already used';
                    }
                    return true;
                  } catch (err) {
                    return 'Error validating Aadhar';
                  }
                },
              })}
              error={!!errors.aadhar}
              helperText={errors.aadhar?.message}
              inputProps={{ maxLength: 12, inputMode: 'numeric', pattern: '\\d*' }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Voter ID"
              size='small'
              {...register('voterId')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Driving Licence"
              size='small'
              {...register('driving_license')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name="religion"
              control={control}
              size='small'
              rules={{ required: 'Religion is required' }}
              render={({ field }) => (
                <Autocomplete
                  disablePortal
                  options={RELIGION_OPTIONS}
                  getOptionLabel={(option) => option.label}
                  fullWidth
                  value={field.value || null}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Religion"
                      size='small'
                      error={!!errors.religion}
                      helperText={errors.religion?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Occupation"
              size='small'
              {...register('occupation', { required: 'Occupation is required' })}
              error={!!errors.occupation}
              helperText={errors.occupation?.message}
              fullWidth
            />
          </Grid>
        </Grid>

      </Fieldset>

    </>

  );
}
function ReviewBlockUi({ userData }) {
  const primaryPhone = userData.phoneNumbers.find(p => p.isDefault)?.number;
  console.log("primaryPhone in review", userData);
  const defaultAddress = userData.address.find(a => a.isDefault);

  return (
    <Container maxWidth="md" >
      <Grid container spacing={3}>
        {/* Header/Profile Card */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
              {userData.name[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                {userData.sName} {userData.name}
              </Typography>
              <Typography color="textSecondary" variant="subtitle1">
                {userData.occupation} • {userData.age} Years Old
              </Typography>
              <Chip label={userData.religion.label} size="small" color="secondary" sx={{ mt: 1 }} />
            </Box>
          </Card>
        </Grid>

        {/* Identity & Contact Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom><Person sx={{ mr: 1, verticalAlign: 'middle' }} /> Identity Info</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography><strong>Father's Name:</strong> {userData.fName}</Typography>
              <Typography><strong>Aadhar:</strong> {userData.aadhar}</Typography>
              <Typography><strong>Voter ID:</strong> {userData.voterId}</Typography>

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom><Email sx={{ mr: 1, verticalAlign: 'middle' }} /> Contact</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography><strong>Email:</strong> {userData.email}</Typography>

              {userData.phoneNumbers.map((phone, index) => (<><Typography><strong>Phone {index + 1}:</strong> {phone.number} {phone.isDefault && <CheckCircleIcon fontSize='small' />}</Typography> </>))}

            </CardContent>
          </Card>
        </Grid>

        {/* Address & Professional Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom><Home sx={{ mr: 1, verticalAlign: 'middle' }} /> Primary Address</Typography>
              <Divider sx={{ mb: 2 }} />

              {userData.address.map((addr, index) => (<Fieldset title={addr.isDefault && <CheckCircleIcon fontSize='small' /> ? 'Default Address' : `Address ${index + 1}`}>
                <Typography>{addr.street}, {addr.landmark}</Typography>
                <Typography sx={{ mb: 1 }}>       {addr.village.villageName} {addr.village.pincode} </Typography>
                <Typography variant="caption" color="textSecondary"> Last Updated: {new Date(addr.village.updatedAt).toLocaleDateString()}</Typography>
              </Fieldset>))}



              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom><Work sx={{ mr: 1, verticalAlign: 'middle' }} /> Occupation</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>{userData.occupation}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

function PhoneNumbars() {
  const { register, control, watch, formState: { errors }, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phoneNumbers',
  });
  const defaultPhNumber = watch('defaultPhNumber');

  return (

    <Box >

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

    </Box>
  );
}

function ContactDetails() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Fieldset title="Contact Details">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Email is invalid',
                },
              })}
              size='small'
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={10}>
            <PhoneNumbars />
          </Grid>
        </Grid>

      </Fieldset>

    </>

  );
}

const TextBlock = ({ label, value }) => (
  <TextField
    label={label}
    value={value}
    size='small'
    InputProps={{ readOnly: true }}
    fullWidth
  />
);

function Address() {
  const [villageList, setVillageList] = useState([]);
  const [addVillage, setAddVillage] = useState(false);

  const { register, control, watch, formState: { errors }, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'address',
  });
  const defaultAddress = watch('defaultAddress');
  const vDetails = watch('address');

  useEffect(() => {
    fetchVillages();
    // eslint-disable-next-line
  }, []);

  const fetchVillages = async () => {
    try {
      const response = await getApiCall('/village/getAllVillages');
      setVillageList(response.data);
    } catch (e) {
      // Optionally handle error
    }
  };

  const fetchVillageDetails = async (village, index) => {
    if (!village) {
      setValue(`address.${index}.details`, []);
      return;
    }
    try {
      const response = await postApiCall('/village/getVillageDetails', village);
      setValue(`address.${index}.details`, [
        { label: 'Mandal', value: response.mDetails.mandal },
        { label: 'District', value: response.dDetails.district },
        { label: 'State', value: response.sDetails.state },
        { label: 'Pincode', value: village.pincode },
      ]);
    } catch (error) {
      // Optionally handle error
    }
  };

  const closeAddVillage = () => {
    fetchVillages();
    setAddVillage(false);
  };

  return (
    <>
      <Fieldset title="Address">

        <Box >
          <CheateVillagePop open={addVillage} onClose={closeAddVillage} />


          <RadioGroup >
            {fields.map((field, index) => (

              <>
                <Fieldset title={`Address ${index + 1}`} key={field.id} sx={{ mb: 2 }}>
                  <Grid container spacing={2} sx={{ px: 2, pb: 2 }} alignItems="center" justifyContent="center" key={field.id}  >

                    <Grid item xs={12} sm={12} sx={{ px: 1, pb: 2 }} >
                      <FormControlLabel
                        value={String(index)}
                        control={
                          <Radio
                            checked={!!watch(`address.${index}.isDefault`)}
                            onChange={() => {
                              // reset all to false
                              fields.forEach((_, i) => setValue(`address.${i}.isDefault`, false));
                              // set only current index to true
                              setValue(`address.${index}.isDefault`, true);
                            }}
                          />
                        }
                        label="Default"
                      />
                      {index + 1 !== 1 && (
                        <IconButton aria-label="delete" sx={{ color: 'red', float: 'right' }} onClick={() => remove(index)} color="error">
                          <DeleteIcon color={'red'} />
                        </IconButton>
                      )}
                    </Grid>
                    <Grid container spacing={2} alignItems="center" justifyContent="right" sx={{ px: 1 }}>
                      <Grid item xs={12} sm={12}>
                        <Controller
                          name={`address.${index}.type`}
                          control={control}
                          defaultValue={null}
                          rules={{ required: 'Type is required' }}
                          render={({ field, fieldState: { error } }) => (
                            <Autocomplete
                              options={ADDRESS_TYPES}
                              getOptionLabel={(option) => option?.label}
                              onChange={(_, value) => field.onChange(value)}
                              value={field.value}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size='small'
                                  label="Type"
                                  error={!!error}
                                  helperText={error ? error.message : ''}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          label="Street"
                          size='small'
                          type="text"
                          {...register(`address.${index}.street`, { required: 'Street is required' })}
                          fullWidth
                          error={!!errors.address?.[index]?.street}
                          helperText={errors.address?.[index]?.street?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          label="Land Mark"
                          size='small'
                          type="text"
                          {...register(`address.${index}.landmark`, { required: 'Land Mark is required' })}
                          fullWidth
                          error={!!errors.address?.[index]?.landmark}
                          helperText={errors.address?.[index]?.landmark?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={10}>
                        <Controller
                          name={`address.${index}.village`}
                          control={control}
                          defaultValue={null}
                          rules={{ required: 'Village is required' }}
                          render={({ field, fieldState: { error } }) => (
                            <Autocomplete
                              options={villageList}
                              getOptionLabel={(option) => option?.villageName || ''}
                              onChange={(_, value) => {
                                field.onChange(value);
                                fetchVillageDetails(value, index);
                              }}
                              value={field.value}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  label="Village"
                                  error={!!error}
                                  helperText={error?.message || ''}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                        <Button color='success' onClick={() => setAddVillage(true)} variant="outlined" startIcon={<AddCircleOutline color={'red'} />}>
                          Village
                        </Button>
                      </Grid>
                      {vDetails[index]?.details?.length > 0 && (
                        <Grid item xs={12} sm={12}>
                          <div style={{ border: '1px dashed green', padding: '10px', borderRadius: '5px' }}>
                            <Grid container spacing={2} alignItems="center" justifyContent="right">
                              {vDetails[index].details.map((item, idx) => (
                                <Grid item xs={12} sm={3} key={idx}>
                                  <TextBlock label={item.label} value={item.value} />
                                </Grid>
                              ))}
                            </Grid>
                          </div>
                          <br />
                        </Grid>
                      )}
                    </Grid>


                  </Grid>

                </Fieldset>
                <Grid item xs={12} sm={12} sx={{ textAlign: 'right' }}>
                  {fields.length === index + 1 && (
                    <Button color='success' variant="contained" onClick={() => append({ type: '', street: '', details: [], isDefault: false })} startIcon={<AddCircleOutline color={'red'} />}>
                      Add Address
                    </Button>
                  )}
                </Grid>
              </>

            ))}
          </RadioGroup>
        </Box>
      </Fieldset>

    </>

  );
}

function Review({ data }) {
  const [reviewList, setReviewList] = useState([]);


  return (
    <Box>

      <ReviewBlockUi userData={data} />
    </Box>
  );
}

export default function RHFStepperForm() {

  const alertCtx = useContext(NotificationContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("isEdit");
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const aadhar = searchParams.get("aadhar");
  const personId = searchParams.get("personId");


  console.log("searchParams", isEdit);

  const [activeStep, setActiveStep] = useState(0);
  let methods = useForm({
    defaultValues: {
      name: 'kumara manikanta',
      sName: 'repuri',
      fName: 'suryanarayana',
      aadhar: aadhar,
      driving_license: 'asdf654654',
      voterId: 'WQE6546547',
      age: '48',
      email: 'kumarmani@gmail.com',
      religion: RELIGION_OPTIONS[0],
      occupation: 'Software Engineer',
      phoneNumbers: [{ type: PHONE_TYPES[0], number: '9491716511', isDefault: true }],

      address: [{
        village: '',
        landmark: 'sdafasdfasd',
        street: 'sdfasfas',
        details: [],
        type: ADDRESS_TYPES[0],
        isDefault: true
      }],

    },
    mode: 'onTouched',
  });
  const personTemMaping = (res) => {
    if (res && res.person && typeof methods.reset === 'function') {
      const person = res.person || {};
      const formData = {
        id: person.id || '',
        name: person.name || '',
        sName: person.sName || person.surname || '',
        fName: person.fName || '',
        age: person.age != null ? String(person.age) : '',
        aadhar: person.aadhar || '',
        voterId: person.voterId || person.voterID || '',
        driving_license: person.driving_license || person.drivingLicense || '',
        email: person.email || '',
        occupation: person.occupation || '',
        userId: person.userId || '',
        // religion should be an option object used by the Autocomplete
        religion:
          (person.religion && RELIGION_OPTIONS.find((r) => r.value === person.religion)) ||
          (person.religion && { value: person.religion, label: person.religion }) ||
          null,
        // map phones to form shape: { type: PHONE_TYPES[*], number, isDefault }
        phoneNumbers: (person.phones || person.phoneNumbers || []).map((p) => ({
          type: (PHONE_TYPES.find((t) => t.value === p.type) || { value: p.type, label: p.type }),
          number: p.number || p.no || '',
          isDefault: !!(p.isPrimary || p.isDefault),
        })),
        // map addresses to form shape: { village: {id, villageName} | null, landmark, street, details, type, isDefault }
        address: (person.addresses || []).map((a) => ({
          village: a.village || (a.villageId ? { id: a.villageId, villageName: a.villageName || '' } : null),
          landmark: a.landmark || '',
          street: a.street || '',
          details: a.details || [],
          type: (ADDRESS_TYPES.find((t) => t.value === a.type) || { value: a.type, label: a.type }),
          isDefault: !!(a.isPrimary || a.isDefault),
        })),
      };

      // Ensure at least one phone/address entry exists to avoid empty arrays in the UI
      if (!formData.phoneNumbers || formData.phoneNumbers.length === 0) {
        formData.phoneNumbers = [{ type: PHONE_TYPES[0], number: '', isDefault: true }];
      }
      if (!formData.address || formData.address.length === 0) {
        formData.address = [
          { village: '', landmark: '', street: '', details: [], type: ADDRESS_TYPES[0], isDefault: true },
        ];
      }

      methods.reset(formData);
    }
  }

  useEffect(() => {

    const fetchDepositorData = async () => {
      if (!id) return;
      try {
        const res = await getApiCallWithParams(`/depositor/${loginUser.forum_id}/${id}`);
        personTemMaping(res);

      } catch (err) {
        console.error('fetchDepositorData error', err);
      }
    }
    const fetchUserData = async () => {
      if (!id) return;
      try {
        const res = await getApiCallWithParams(`/users/${id}`);
        personTemMaping(res);
        console.log("user data", res);

      } catch (err) {
        console.error('fetchUserData error', err);
      }

    };
    console.log("type", type)
    if (isEdit && type === 'user') {
      fetchUserData();
    } else if (isEdit && type === 'dipositor') {
      fetchDepositorData();
    }

  }, [type, id]);


  const { handleSubmit, trigger, getValues, reset } = methods;

  const stepFields = [
    ['name', 'sName', 'fName', 'age', 'aadhar', 'religion', 'occupation'],
    ['email', 'phoneNumbers'],
    ['address'],
  ];





  const handleNext = async () => {
    if (type === 'user') {
      stepFields[0].unshift('userId', 'password', 'confirmPassword', 'userRole', 'forumName')

    }
    const valid = await trigger(stepFields[activeStep]);
    if (valid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  const successAction = (res) => {

    console.log("res after create person", res.navigteId);
    alertCtx.setNotification({ message: 'Person created successfully', type: 'success' })
    reset({
      state: "",
      district: "",
      mandal: null,
      villageName: "",
      pincode: "",
      phoneNumbers: [{ type: PHONE_TYPES[0], number: '', isDefault: true }],
      address: [{
        village: '',
        landmark: '',
        street: '',
        details: [],
        type: ADDRESS_TYPES[0],
        isDefault: true
      }],
      name: '',
    });

    if (isEdit) {
      navigate(`/app/${type}/${loginUser.forum_id}/${res.navigateId}`);
    } else {
      if (type === 'user') {
        navigate(`/app/${type}/${loginUser.forum_id}/${res.navigateId}`);
      } else if (type === 'dipositor') {
        navigate(`/app/${type}/${loginUser.forum_id}/${res.navigateId}`);
      }
    }



    /* 
              if(type === 'user'){
                if(isEdit){
                navigate(`/app/userPage/${id}`);
                }else{
                  navigate(`/app/userPage/${res.user.id}`);
                }
           }else if(type === 'dipositor'){
            if(isEdit){
                navigate(`/app/userPage/${id}`);
                }else{
                  
                }
    
           } */
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
    console.log("form data before submit", data);
    const phoneNoData = data.phoneNumbers.map((phone) => ({
      type: phone.type?.value,
      number: phone.number,
      isPrimary: phone.isDefault
    }
    )
    );

    const addressData = data.address.map((addr) => ({
      type: addr.type?.value,
      street: addr.street,
      villageId: addr.village?.id,
      landmark: addr.landmark,
      isPrimary: addr.isDefault
    }));
    data.phoneNumbers = phoneNoData;
    const postData = {}
    postData.name = data.name;
    postData.sName = data.sName;
    postData.fName = data.fName;
    postData.age = +data.age;
    postData.aadhar = data.aadhar;
    postData.voterId = data.voterId;
    postData.driving_license = data.driving_license;
    postData.religion = data.religion?.value;
    postData.occupation = data.occupation;
    postData.email = data.email;
    postData.personType = type;
    postData.phones = data.phoneNumbers
    postData.addresses = addressData
    postData.password = data.password
    postData.userId = data.userId
    postData.role_id = +data?.userRole?.id || 0
    postData.forum_id = +data?.forumName?.id || 0

    if (!isEdit) {
      postData.id = id;
    }
    try {
      if (!isEdit) {
        await postApiCall('/person/create', postData).then((res) => {
          successAction(res);

        }).catch((error) => {
          failedAction(error);
        });
      } else {
        postData.navigateId = id
        console.log("postData for edit", data);
        await postApiCall(`/person/${personId}/update`, postData).then((res) => {

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

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%', maxWidth: '90%', mx: 'auto', mt: 5 }}>
        <Card >
          <CardContent>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step sx={{
                  cursor: "pointer",
                }} key={label}>
                  <StepLabel sx={{ cursor: "pointer" }} onClick={() => {
                    console.log('clicked step', index); setActiveStep(index);

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
              <Card spacing={2} sx={{ minWidth: '50%', p: 2 }}>
                <CardContent>
                  {activeStep === 0 && <PersonalInfo />}
                  {activeStep === 1 && <ContactDetails />}
                  {activeStep === 2 && <Address />}
                  {activeStep === 3 && <Review data={getValues()} />}
                </CardContent>
              </Card>
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
            </form>
          )}
        </Box>
      </Box>
    </FormProvider>
  );
}
