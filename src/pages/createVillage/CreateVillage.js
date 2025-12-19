import React, { useEffect } from "react";
import { useForm,Controller } from "react-hook-form";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Autocomplete
} from "@mui/material";
import VillageLayout from "../../components/VillageLayout/VillageLayout";
import { getStates,toCheckState ,createState} from '../../nest_api';
import NotificationContext from "../../store/alert-context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
const CreateVillage = () => {
    const [selState, setSelState] = React.useState("");
    const [selDistrict, setSelDistrict] = React.useState("");
    const [mandalList, setMandalList] = React.useState("");

const alertCtx = useContext(NotificationContext);
    useEffect(() => {
      fatchMandals()
    }, []);
    
     const fatchMandals = async () => {
      try {
        const response = await getStates('village/getAllMandals')
        setMandalList(response)
        console.log('response',response)
      } catch (error) {
        console.error("Error fetching states:", error);
      }
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm({defaultValues: {
          state: "",
          district: "",
          mandal: null,
          villageName: "",
          pincode: "",
        },});

  
const fetchDistrict = async (value) => {
   console.log('value',value)
  try {
   const response = await toCheckState(`/village/getDistrictById/${value.district_id}`)
   setSelDistrict(response)
   setValue("district", response.district)
  
  }catch (error) {
  }
}
const fetchState = async (value) => {
   console.log('value',value)
   if(value === null){
    setValue("district", "")
    setValue("state", "")
    return
   }
  try {
   const {state} = await toCheckState(`/village/getStateById/${value.state_id}`)
   setValue("state", state.state)
   setSelState(state)
  console.log('id',response)
  }catch (error) {
    console.error("Error fetching states:", error);
  }
}
  const onSubmit = async (data) => {
    console.log(data);
    const villageData = {
      villageName: data.villageName,
      pincode: +data.pincode,
      mandal: data.mandal.id,
      district: data.mandal.district_id,
      state: data.mandal.state_id
    };

  const response = createState('/village/createVillage',villageData)
  response.then((res) => {
            console.log('res',res)
            if (res.message) {
                alertCtx.setNotification({message: res.message, type: 'success'})   
                reset({villageName: '', district: '', mandal: null, pincode: '', state: ''})
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
    <VillageLayout title="Create Village">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ my: 2 }}>
            <TextField
              fullWidth
              label="Village Name"
              variant="outlined"
              {...register("villageName", { required: "Village name is required",validate: async (value) => {
                                                      try {
                                                        const res = await toCheckState(`village/checkVillage/${value}`);
                                                        console.log('API response:', res);
                                                        if (!res.isValid) {
                                                          return res.message;
                                                        }
                                                        return true;
                                                      } catch (error) {
                                                        console.error('Validation error:', error);
                                                        return 'Error validating state';
                                                      }
                                                    }, })}
              error={!!errors.villageName}
              helperText={errors.villageName?.message}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
             <Controller
                            name="pincode"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Pincode is required', pattern: {
                                  value: /^[1-9][0-9]{5}$/,
                                  message: "Invalid pincode",
                                }, }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label="Pincode"
                                    type="number"
                                    variant="outlined"
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                    fullWidth
                                />
                            )}
                        />

          </Box>

       
          <Box sx={{ mb: 2 }}>
             <Controller
                name="mandal"
                control={control}
                defaultValue={null}
                rules={{ required: 'mandal is required' }}
                render={({ field ,fieldState: { error }}) => (
        
          <Autocomplete
            options={mandalList}
            getOptionLabel={(option) => option.mandal}
            onChange={(_, value) => {
              fetchDistrict(value)
              fetchState(value) 
              
              field.onChange(value)}}
            value={field.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Mandal"
                error={!!error}
                helperText={error ? error.message: ''}
              />
            )}
          />
        )}
      />
          </Box>
              <Box sx={{ mb: 2 }}>
             <Controller
                            name="district"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'district is required' }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label="District"
                                    InputProps={{
                                        readOnly: true
                                      }}
                                    variant="outlined"
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                    fullWidth
                                />
                            )}
                        />

          </Box>



<Box sx={{ mb: 2 }}>
             <Controller
                            name="state"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'state is required' }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label="State"
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true
                                      }}
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                    fullWidth
                                />
                            )}
                        />

          </Box>
         
         

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Create Village
          </Button>
        </form>
     </VillageLayout>
  );
};

export default CreateVillage;
