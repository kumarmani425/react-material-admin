import React,{useContext} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box,Autocomplete } from '@mui/material';
import { getStates,createState,toCheckState } from '../../nest_api';
import NotificationContext from '../../store/alert-context';
import VillageLayout from '../../components/VillageLayout/VillageLayout';


  
const CreateDistrict = () => {
    const [state, setState] = React.useState([]);
    
    const alertCtx = useContext(NotificationContext);

    React.useEffect(() => {
        fetchStates()
        // This effect runs when the component mounts
        // You can perform any side effects here, such as fetching data or setting up subscriptions
    },[])
    const fetchStates = async () => {
        try {
            // Fetch states from the API or perform any other asynchronous operation
            const response = await getStates('/village/getStates')
            const onlyState = response.states.map((state) => {return {state: state.state, id: state.id}})
            console.log('onlyState',onlyState)
            setState(onlyState)
        } catch (error) {   
            console.error('Error fetching states:', error);
        }   
    }


    const { handleSubmit, control, reset,errors,setValue } = useForm({
        defaultValues: {
          stateName: null,
        },
      });

    const onSubmit = (data) => {
        const response = createState('village/postDistrict', {
            state_id: data.stateName.id,  
            district: data.district,
        });
        response.then((res) => {
            
            if (res.message) {
                alertCtx.setNotification({message: 'District created successfully', type: 'success'})   
                reset({stateName: null, district: ''})
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
        reset({stateName: null, district: ''});   
    };

    return (
        <VillageLayout title="Create District">
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: 'auto', mt: 2 }}
        >
             <Controller
        name="stateName"
        control={control}
        defaultValue={null}
        rules={{ required: 'State is required' }}
        render={({ field ,fieldState: { error }}) => (
        
          <Autocomplete
            options={state}
            getOptionLabel={(option) => option.state}
            onChange={(_, value) => field.onChange(value)}
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
      />
          
            <Controller
                name="district"
                control={control}
                defaultValue=""
                rules={{ required: 'District is required',validate: async (value) => {
                       try {
                        const res = await toCheckState(`village/checkDistrict/${value}`);
                         console.log('API response:', res);
                        if (!res.isValid) {
                           return 'District already exists';
                         }
                         return true;
                        } catch (error) {
                        console.error('Validation error:', error);
                        return 'Error validating District';
                        }
                       }, }}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        label="District"
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

export default CreateDistrict;