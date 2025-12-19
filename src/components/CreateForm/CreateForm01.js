import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { createSeller } from "../../api";

export default function CreateForm() {
  const history = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (data) => {
    try {
      const depResponse = await createSeller('seller/createSeller', {
        name: data.name,
        fName: data.fName,
        phNumber: data.phoneNumber,
        village: data.village,
      });

      if (depResponse.sellerDetails) {
        history.push(`/app/sellerPage/${depResponse.sellerDetails.sellerId}`);
      }
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {/* Button to Open Dialog */}
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Seller
      </Button>

      {/* Dialog Box */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h5">Create Seller</Typography>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <TextField
              fullWidth
              label="Seller Name"
              variant="outlined"
              size="small"
              margin="normal"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            {/* Father Name Field */}
            <TextField
              fullWidth
              label="Father Name"
              variant="outlined"
              size="small"
              margin="normal"
              {...register("fName", { required: "Father Name is required" })}
              error={!!errors.fName}
              helperText={errors.fName?.message}
            />
            {/* Phone Number Field */}
           <TextField
          fullWidth
          label="Phone Number"
          type="number"
          size="small"
          variant="outlined"
          margin="normal"
          {...register("phoneNumber", { 
            required: "Phone number is required",
            minLength: { value: 10, message: "Phone number must be at least 10 digits" },
            maxLength: { value: 10, message: "Phone number cannot exceed 10 digits" }
          })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
        />

            {/* Village Field */}
            <TextField
              fullWidth
              label="Village"
              size="small"
              variant="outlined"
              margin="normal"
              {...register("village", { required: "Village is required" })}
              error={!!errors.village}
              helperText={errors.village?.message}
            />
            {/* Submit Button */}
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Create Seller
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}









