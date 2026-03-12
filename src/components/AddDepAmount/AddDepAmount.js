import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  Select,
  MenuItem,
  Grid,
  Box,
  CircularProgress,
  FormHelperText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DatePickerComponent from "../DatePicker/DatePicker";
import { depAddAmount } from "../../api";
import { postApiCall } from "../../nest_api";


import {

  Paid as PaidIcon,
  Percent as PercentIcon,
  Info as InfoIcon,
  SwapHoriz as TypeIcon,
  Event as EventIcon
} from "@mui/icons-material";

// ... inside your component

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function AddDepAmount({ toOpen, onClose }) {
  const [open, setOpen] = React.useState(toOpen);
  const [age, setAge] = React.useState('');
  const [loading, setLoading] = React.useState(false); // ✅ Loading state
  const { id } = useParams();
  console.log("AddDepAmount id", id);
  const handleChange = (event) => {
    setAge(event.target.value);
  };


  React.useEffect(() => {
    setOpen(toOpen);
  }, [toOpen]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      date: new Date(),
      amount: "",
      interestRate: "",
      information: "",
    },
  });

  // ✅ Handle form submission with loading state
  const onSubmit = async (data) => {
    setLoading(true); // ✅ Set loading to true
    const token = localStorage.getItem("token");

    try {

      const response = await postApiCall("dep-transactions", {
        createdAt: new Date(data.date).toISOString(),
        amount: +data.amount,
        inst_rate: +data.interestRate,
        type: data.type,
        dep_id: id,
        days: 0,
        p_type: "create",
        t_date: new Date(),
        info: data.Information,
        status: "P",
      });


      if (response) {
        console.log("Deposit Added Successfully");
        reset(); // ✅ Reset the form after submission
        handleClose();
      } else {
        console.error("Failed to add deposit");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // ✅ Stop loading after request completes
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };
  const onBlur = (data) => {
    console.log(data)
  }

  return (


    <BootstrapDialog
      maxWidth="sm" // Changed to sm as it fits a 2-column form better
      fullWidth
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        sx={{
          m: 0, p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
        id="customized-dialog-title"
      >
        <PaidIcon /> Add Deposit Amount
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "white !important",
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid container spacing={3}>
            {/* Date Picker Row */}
            <Grid item xs={12} md={6}>
              <DatePickerComponent controlForm1={control} errorsForm1={errors} onBlur={onBlur} />
            </Grid>

            {/* Type Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.type} size="small">
                <InputLabel id="type-select-label">Transaction Type</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="type-select-label"
                      label="Transaction Type"
                      startAdornment={<TypeIcon sx={{ mr: 1, color: 'action.active' }} fontSize="small" />}
                    >
                      <MenuItem value={'credit'}>Credit</MenuItem>
                      <MenuItem value={'debit'}>Debit</MenuItem>
                    </Select>
                  )}
                />
                {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Amount Field */}
            <Grid item xs={12} md={6}>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Amount is required",
                  min: { value: 1, message: "Must be > 0" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount"
                    type="number"
                    size="small"
                    fullWidth
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PaidIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Interest Rate Field */}
            <Grid item xs={12} md={6}>
              <Controller
                name="interestRate"
                control={control}
                rules={{
                  required: "Interest rate is required",
                  min: { value: 0.1, message: "Must be > 0" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Interest Rate"
                    size="small"
                    type="number"
                    fullWidth
                    error={!!errors.interestRate}
                    helperText={errors.interestRate?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <PercentIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Information Field - Full Width */}
            <Grid item xs={12}>
              <Controller
                name="Information"
                control={control}
                rules={{ required: "Information is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Transaction Notes / Information"
                    type="text"
                    multiline // Critical for text areas
                    rows={2}
                    fullWidth
                    error={!!errors.information}
                    helperText={errors.information?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <InfoIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Action Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 1, height: 48 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Save Transaction"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </BootstrapDialog>


  );
}
