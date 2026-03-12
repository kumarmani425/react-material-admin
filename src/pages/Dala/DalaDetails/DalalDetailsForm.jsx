import React , {useState} from "react";
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
import DataGridComponent from '../DalaDetails/DalalDetailsForm'

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { postApiCall } from "../../../nest_api";

const DalalDetailsForm = () => {
  const [categories, setCategories] = useState([]);
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
        { field: 'c_name', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 250 },
        { field: 'size_grade', headerName: 'Size Grade', width: 150 },
        { field: 'quality_grade', headerName: 'Quality Grade', width: 150 },
        { field: 'status', headerName: 'Status', width: 120 },
        /*  {
             field: 'actions',
             headerName: 'Actions',
             width: 180,
             renderCell: (params) => (
                 <>
                     <button onClick={() => handleEdit(params.row)}>Edit</button>
                     <button onClick={() => handleDelete(params.row.id)}>Delete</button>
                 </>
             ),
         }, */
    ];


  const onSubmit = async (data) => {
    
     try {
        const postData = {name:data.name, 
            address:data.address,
            phone_no:data.phone_no
        }
      const dalalRes = await postApiCall('dalal-details/postDalalDetails', postData)

      alert("Dalal Details Saved Successfully");

      reset();

    } catch (error) {
      console.error(error);
      alert("Error saving data");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: "auto", mt: 5 }}>

      <Typography variant="h6" gutterBottom>
        Dalal Details Form
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>

        <Grid container spacing={2}>
          {/* Name */}
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
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

          <Grid item xs={12}>
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

          <Grid item xs={12}>
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


       <AppBar position="static" sx={{ textTransform: "capitalize", borderRadius: '8px 8px 0 0' }}>
                      <Toolbar variant="dense">
                          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                              Category List
                          </Typography></Toolbar></AppBar>
                  <Box >
                      <Card variant="outlined" spacing={2} sx={{ minWidth: '50%', p: 2 }}>
                          <CardContent>
                            {/*   <DataGridComponent pageLink={'title'} tableData={categories} columns={columns} loading={loading} /> */}
                          </CardContent>
                      </Card>
                  </Box>
    </Paper>
  );
};

export default DalalDetailsForm;