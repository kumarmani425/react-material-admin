import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { withRouter,useNavigate } from "react-router-dom";
import { TextField, MenuItem, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";

import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { set } from "lodash";
import { pink } from '@mui/material/colors';
import InputAdornment from '@mui/material/InputAdornment';
import { createDipositor } from "../../api";
export default function CreateDipositor() {
  const history = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },setValue
  } = useForm();
  const [state, setState] = React.useState({
    isInvester: false,
    
  });
  
  const [totalPPpercentage, setTotalPPpercentage] = useState(0);
  const token = localStorage.getItem('token');
  const onSubmit = async(data) => {

    try{
      const depResponce = await createDipositor('dipositor/createDipositor', {
        name: data.dipositorName,
        fname: data.fName,
        phNumber: data.phoneNumber,
        village: data.village,
        isInvester: state.isInvester,
        PPpercentage: data.PPpercentage
      })

        if(depResponce.depDetails){
          history.push(`/app/dipositorPage/${depResponce.depDetails.dipositorId}`)
        }
    }catch{error => console.log("error",error)}
    
  };
  
  const { isInvester } = state;
  useEffect(() => {
    fetch("http://localhost:8080/dipositor/dispositorList", {
      method: "GET",
      headers: { "Content-Type": "application/json", 
        'Authorization' : 'Bearer '+token
      }
     

    }).then((res) => {
      console.log("dispositorList",res)
      if(res.status === 200){
        res.json().then((res) => {
          console.log('res',res);
          const total = res.dipositors.reduce((sum, obj) => sum + obj.PPpercentage, 0);
          setTotalPPpercentage(total);
          
        })
       
      }
  });

   }, []);



  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
      <CardHeader title={<Typography variant="h5">Create Dipositor</Typography>} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <TextField
            fullWidth
            label="Dipositor
             Name"
            variant="outlined"
            margin="normal"
            {...register("dipositorName", { required: "Name is required" })}
            error={!!errors.dipositorName}
            helperText={errors.dipositorName?.message}
          />
          {/* Father Name Field */}
          <TextField
                      fullWidth
                      label="Father
                      Name"
                      variant="outlined"
                      margin="normal"
                      {...register("fName", { required: "father Name is required" })}
                      error={!!errors.fName}
                      helperText={errors.fName?.message}
                    />
          {/* Amount Field */}
          <TextField
            fullWidth
            label="Phone Number"
            type="number"
            variant="outlined"
            margin="normal"
            {...register("phoneNumber", { required: "Phonenumber is required", min: { value: 10, message: "Minimum amount is 1" } })}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />
          {/* Village  */}
          <TextField
            fullWidth
            label="Village"
            variant="outlined"
            margin="normal"
            {...register("village", { required: "village is required" })}
            error={!!errors.village}
            helperText={errors.village?.message}
          />
          
          {/* <FormControlLabel required control={ <Switch
      color="primary"
      checked={checked}
      defaultChecked 
      onChange={(e) => setChecked(e.target.checked)}
    />} label="Is it Invester" /> */}
    <FormControlLabel
            control={
              <Checkbox checked={isInvester} name="IsInvester" disabled = {totalPPpercentage >= 100 }   onChange={(e) => { setValue("PPpercentage", "");
                setState({ ...state, isInvester: e.target.checked });
              } }  />
            }
            label="Is it Invester"
          />
          
         {isInvester && <TextField
            fullWidth
            label="Partnership Percentage"
            type="number"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">kg</InputAdornment>,
              },
            }}
            margin="normal"
            {...register("PPpercentage", { required: "Partnership Percentage is required", min: { value: 1, message: "Minimum amount is 1" }, max: { value: 100-totalPPpercentage, message: `Maximum Percentage is ${100-totalPPpercentage}`} })}
            error={!!errors.PPpercentage}
            helperText={errors.PPpercentage?.message}
          />}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Deposit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

