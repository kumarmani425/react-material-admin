import React,{useContext} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box,Autocomplete } from '@mui/material';
import { getStates,toCheckState ,createState} from '../../nest_api';
import NotificationContext from '../../store/alert-context';
import VillageLayout from '../../components/VillageLayout/VillageLayout';


  
const CreateMandal = () => {
    const [state, setState] = React.useState([]);
    const [district, setDistrict] = React.useState([]);
    
    const alertCtx = useContext(NotificationContext);

    React.useEffect(() => {
        //fetchStates()
        fetchDistricts()
    },[])

    const fetchDistricts = async (id) => {
        try {
            // Fetch states from the API or perform any other asynchronous operation
            const response = await getStates(`/village/getAllDistricts`)
            setDistrict(response.district)
          console.log('response',response.district)
        } catch (error) {
            console.error('Error fetching states:', error); 
        }
    }

    /* const fetchStates = async () => {
        try {
            // Fetch states from the API or perform any other asynchronous operation
            const response = await getStates('/village/getStates')
            const onlyState = response.states.map((state) => {return {state: state.state, id: state.id}})
            console.log('onlyState',onlyState)
            setState(onlyState)
        } catch (error) {   
            console.error('Error fetching states:', error);
        }   
    } */
    const getStateById = async (id) => {
      console.log('id',id)
        try {     
            // Fetch states from the API or perform any other asynchronous operation
            const response = await toCheckState(`/village/getStateById/${id}`)
            const { state } = response
            console.log('getStateById',state)
            setState(state)
            setValue('stateName',state.state)
           
        } catch (error) {
            console.error('Error fetching states:', error); 
        }
    }
    const fetchDistrict = async (id) => {
        try {   
            // Fetch states from the API or perform any other asynchronous operation
            const response = await toCheckState(`/village/getDistrict/${id}`)
            const onlyDistrict = response.district.map((district) => {return {district: district.district, id: district.id}})
            console.log('onlyDistrict',onlyDistrict)
            setDistrict(onlyDistrict)
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    }


    const { handleSubmit, control, reset,formState: { errors } ,setValue } = useForm({
        defaultValues: {
          stateName: '',
          district: null,
          mandal: ''
        },
      });

    const onSubmit = (data) => {
        console.log('Form Data:', data);


        const response = createState('village/postMandal', {
            state_id: state.id,  
            district_id: data.district.id,
            mandal: data.mandal,
            
        });
        response.then((res) => {
            
            if (res.message) {
                alertCtx.setNotification({message: res.message, type: 'success'})   
                reset({stateName: '', district: null, mandal: ''})
                console.log('District created successfully:', res.stateDetails);    
            } else {
                alertCtx.setNotification({message: 'Error creating district', type: 'error'})   
                console.error('Error creating district:', res.error);
            }   
        }).catch((error) => {
            alertCtx.setNotification({message: 'Error creating district', type: 'error'})
            console.error('Error:', error);
        });
        console.log('Form Data:', data);
        setValue('stateName', null); // Reset the stateName field to null
        reset({stateName: '', district: null, mandal: ''});   
    };

    return (
        <VillageLayout title="Create Mandal">
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: 'auto', mt: 2 }}
        >

          
            {/*  <Controller
        name="stateName"
        control={control}
        defaultValue={null}
        rules={{ required: 'State is required' }}
        render={({ field ,fieldState: { error }}) => (
        
          <Autocomplete
            options={state}
            getOptionLabel={(option) => option.state}
            onChange={(_, value) =>{ field.onChange(value)
                setValue('district', null);  // Reset district when state changes
                fetchDistrict(value.id) // Fetch districts based on selected state
            }}
            value={field.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select State"
                error={!!error}
                helperText={error ? error.message: ''}
              />
            )}
          />
        )}
      /> */}
       <Controller
        name="district"
        control={control}
        defaultValue={null}
        rules={{ required: 'District is required' }}
        render={({ field ,fieldState: { error }}) => (
        
          <Autocomplete
            options={district}
            getOptionLabel={(option) => option?.district}
            onChange={(_, value) => {field.onChange(value)
                getStateById(value?.state_id) // Fetch districts based on selected state
            }}
            value={field.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select district"
                error={!!error}
                helperText={error ? error.message: ''}
              />
            )}
          />
        )}
      />

       <Controller
                name="stateName"
                control={control}
                defaultValue=""
                rules={{ required: 'State is required' }}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        label="State"
                        variant="outlined"
                        error={!!error}
                        helperText={error ? error.message : ''}
                        fullWidth
                    />
                )}
            />
          
            <Controller
                name="mandal"
                control={control}
                defaultValue=""
                rules={{ required: 'madal is required', validate: async (value) => {
                                        try {
                                          const res = await toCheckState(`village/checkMandal/${value}`);
                                          console.log('API response:', res);
                                          if (!res.isValid) {
                                            return 'State already exists';
                                          }
                                          return true;
                                        } catch (error) {
                                          console.error('Validation error:', error);
                                          return 'Error validating state';
                                        }
                                      }, }}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        label="Mandal"
                        variant="outlined"
                        error={!!error}
                        helperText={error ? error.message : ''}
                        fullWidth
                    />
                )}
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
        </VillageLayout>
    );
};

export default CreateMandal;