import React, {useContext,useState,useEffect} from 'react';
import { useForm } from "react-hook-form";
import { TextField, Button, Box ,Container,Typography} from '@mui/material';
import { createState,toCheckState } from "../../nest_api"; // Adjust the import path as necessary
import SuccessPopover from '../alert/SuccessPopover';
import NotificationContext from '../../store/alert-context';
import { set } from 'lodash';
import VillageLayout from '../../components/VillageLayout/VillageLayout';

const CreateState = () => {
    const alertCtx = useContext(NotificationContext);
    
    const { register, handleSubmit, formState: { errors },reset  } = useForm({
        defaultValues: {state: ''}
    });
    


    const onSubmit = (data) => {
        alertCtx.setNotification({message: 'pending....', type: 'warning'})

        const response = createState('village/postState', {
            state: data.state,
        });
        response.then((res) => {
            console.log('Response:', res);
            if (res.message) {
                alertCtx.setNotification({message: 'State created successfully', type: 'success'})
                reset({state: ''})
                console.log('State created successfully:', res.stateDetails);
            } else {
                alertCtx.setNotification({message: 'Error creating state', type: 'error'})

                console.error('Error creating state:', res.error);
            }
        }).catch((error) => {
            alertCtx.setNotification({message: 'Error creating state', type: 'error'})

            console.error('Error:', error);
    });
   /*  const timer = setTimeout(() => {
        setToAlert(null);
      }, 3000);
   */
      return () => clearTimeout(timer);
    }

    
    return (
        <VillageLayout title="Create State">
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: 'auto', mt: 2 }}
        >
           
            <TextField
                label="State Name"
                variant="outlined"
                {...register('state', {
                    required: 'State name is required',
                    minLength: { value: 3, message: 'Minimum 3 characters required' },
                    validate: async (value) => {
                        try {
                          const res = await toCheckState(`village/stateCheck/${value}`);
                          console.log('API response:', res);
                          if (!res.isValid) {
                            return 'State already exists';
                          }
                          return true;
                        } catch (error) {
                          console.error('Validation error:', error);
                          return 'Error validating state';
                        }
                      },
                })}
                             
                 error={!!errors?.state}
                helperText={errors?.state?.message}
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
        </VillageLayout>
    );
};

export default CreateState;