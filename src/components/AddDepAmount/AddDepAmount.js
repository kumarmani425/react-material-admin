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
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DatePickerComponent from "../DatePicker/DatePicker";
import { depAddAmount } from "../../api";

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
  const [loading, setLoading] = React.useState(false); // ✅ Loading state
  const { id } = useParams();

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
    },
  });

  // ✅ Handle form submission with loading state
  const onSubmit = async (data) => {
    setLoading(true); // ✅ Set loading to true
    const token = localStorage.getItem("token");

    try {

      const response =  await depAddAmount("dipositor/addAmount",{
        createdDate: data.date,
        pAmount: data.amount,
        interestRate: data.interestRate,
        depId: id,
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
      maxWidth={"md"}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Add Deposit Amount
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <DatePickerComponent controlForm1={control} errorsForm1={errors} onBlur={onBlur} />

          <Controller
            name="amount"
            control={control}
            rules={{
              required: "Amount is required",
              min: { value: 1, message: "Amount must be greater than 0" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Amount"
                type="number"
                fullWidth
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            )}
          />

          <Controller
            name="interestRate"
            control={control}
            rules={{
              required: "Interest rate is required",
              min: { value: 0.1, message: "Interest rate must be greater than 0" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Interest Rate (%)"
                type="number"
                fullWidth
                error={!!errors.interestRate}
                helperText={errors.interestRate?.message}
              />
            )}
          />

          {/* ✅ Submit Button with Loading State */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading} // Disable button when loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
}
