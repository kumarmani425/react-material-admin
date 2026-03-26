import React , {useEffect, useState, useContext} from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  InputAdornment,
  AppBar ,
  Toolbar,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import DataGridComponent from '../../../components/DataGrid/DataGridComponent'

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import NotificationContext from "../../../store/alert-context";
import { useForm, Controller } from "react-hook-form";
import { getApiCall, postApiCall, getApiCallWithParams } from "../../../nest_api";

const DalalDetailsForm = () => {

  const alertCtx = useContext(NotificationContext);
  const [dalalList, setDalalList] = useState([]);
const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      order_id: "",
      name: "",
      phone_no: "",
      address: ""
    }
  });
  const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Dalal Name', width: 200 },
        { field: 'phone_no', headerName: 'Phone Number', width: 250 },
        { field: 'address', headerName: 'address', width: 150 },
        { field: 'user', headerName: 'create By', width: 150 },
       
    ];

    const fetchDalalList = async () => {
        const res = await getApiCall('dalal-details/getAllDalals')
        console.log("dalal list res", res)
        const convertList = res.map((item) => {

          return {
            id:item.id
          }
        })

       setDalalList(res)

      }

    useEffect(() => {
      
      fetchDalalList()
    },[])

    const successAction = (res) => {

        alertCtx.setNotification({ message: 'Dalal Created successful!', type: 'success' })

    }
    const failedAction = (error) => {
        const message = error.response?.data?.message || error.message;
        if (message) {
            alertCtx.setNotification({ message: message, type: 'error' })
        } else {
            alertCtx.setNotification({ message: 'An unknown error occurred', type: 'error' })
        }

    }
  const onSubmit = async (data) => {
    
     try {
        const postData = {name:data.name, 
            address:data.address,
            phone_no:data.phone_no
        }
      const dalalRes = await postApiCall('dalal-details/postDalalDetails', postData)
      reset();
        fetchDalalList()
        successAction(dalalRes)
    } catch (error) {
      console.error(error);  
      failedAction(error)    
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ textTransform: "capitalize", borderRadius: '8px 8px 0 0' }}>
                <Toolbar variant="dense">
                    <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        Create Dalal Details
                    </Typography></Toolbar></AppBar>
            <Box >
                <Card variant="outlined" spacing={2} sx={{ minWidth: '50%', p: 2 }}>
                    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)}>

        <Grid  sx = {{maxWidth: '70%', margin: '0 auto'}}  justifyContent="center"    container spacing={2}>
          {/* Name */}
          <Grid item xs={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required",
                validate: async (value) => {
                                                                if (!value) return true;
                                                                console.log('value', value)
                                                                try {
                                                                   
                                                                    const res = await getApiCallWithParams(`/dalal-details/checkDalalName/${encodeURIComponent(value)}`);
                                                                    console.log("ers", res)
                                                                    if (res && (res.exists === true || res.user)) {
                                                                        return 'Dalal name already exists';
                                                                    }
                                                                    return true;
                                                                } catch (err) {
                                                                    console.log('err', err)
                                                                    return 'Error validating Dalal name';
                                                                }
                                                            },
                
               }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  size="small"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>

          {/* Phone */}

          <Grid item xs={6}>
            <Controller
              name="phone_no"
              control={control}
              rules={{
                required: "Phone number required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                   size="small"
                  fullWidth
                  error={!!errors.phone_no}
                  helperText={errors.phone_no?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>

          {/* Address */}

          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  multiline
                  rows={2}
                   size="small"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
 </CardContent>
                </Card>
            </Box>
            <br></br>

     {dalalList.length > 0 && <><AppBar position="static" sx={{ textTransform: "capitalize", borderRadius: '8px 8px 0 0' }}>
                      <Toolbar variant="dense">
                          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                              Category List
                          </Typography></Toolbar></AppBar>
                  <Box >
                      <Card variant="outlined" spacing={2} sx={{ minWidth: '50%', p: 2 }}>
                          <CardContent>
                              <DataGridComponent pageLink={'title'} tableData={dalalList} columns={columns} loading={loading} /> 
                          </CardContent>
                      </Card>
                  </Box></>}  
    </>
  );
};

export default DalalDetailsForm;