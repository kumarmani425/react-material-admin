import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Box,
  Divider,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import Switch from '@mui/material/Switch';
import { getDaysBetweenDates } from "../../utils/utils";
import { depPayment } from "../../api";
import { postApiCall } from "../../nest_api";
import DatePickerComponent from "../DatePicker/DatePicker";
import { el } from "date-fns/locale";
import { type } from "os";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export default function DepPayment({ toOpen, onClose, pandingRecord }) {
  const [open, setOpen] = React.useState(toOpen);
  const [addAmount, setAddAmount] = React.useState(false);
  const [pRecord, setPRecord] = React.useState(pandingRecord);
  const [payDetails, setPayDetails] = React.useState({
    date: new Date().toISOString(),
    interestRate: pandingRecord?.inst_rate || 0,
  });

  React.useEffect(() => {
    if (toOpen) {
      setOpen(true);
      setPRecord(pandingRecord);
      setPayDetails({
        date: new Date().toISOString(),
        interestRate: pandingRecord?.inst_rate || 0,
      });
      calculateInterest(
        pandingRecord?.amount,
        pandingRecord?.inst_rate,
        pandingRecord?.createdAt,
        new Date().toISOString()
      );
    }
  }, [toOpen]);

  const {
    handleSubmit: handleSubmitForm1,
    control: controlForm1,
    formState: { errors: errorsForm1 },
    reset: reset1,
  } = useForm({ defaultValues: { date: new Date(), interestRate: pandingRecord?.inst_rate || 0, payAmount: null } });


  const handleClose = () => {
    setOpen(false);
    onClose?.();
    reset1();
  };

  const updatePaymentDetails = (data) => {
    setPayDetails({
      ...data,
      date: new Date(data.date).toISOString(),
      interestRate: data.interestRate,
    });
    calculateInterest(
      pandingRecord.amount,
      +data.interestRate,
      pandingRecord.createdAt,
      data.date
    );
  };

  const calculateInterest = (pAmount, interestRate, startDate, endDate) => {
    const days = getDaysBetweenDates(startDate, endDate);
    const interestAmount = Math.round((pAmount * parseInt(interestRate) * days) / 36500);
    setPRecord((prev) => ({
      ...prev,
      interestAmount,
      totalPayAmount: +pAmount + interestAmount,
      days,
    }));
  };
  React.useEffect(() => {
    if (toOpen && pandingRecord) {
      // ... your existing logic

      // Explicitly reset the form with the new data
      reset1({
        date: new Date(),
        interestRate: pandingRecord.inst_rate || 0
      });
    }
  }, [toOpen, pandingRecord, reset1]);
  const handlePayment = async (data) => {
    let status = "C";
    let finalAmount = pRecord.totalPayAmount;
    let payedAmount = data.payAmount;


    if (finalAmount === +data.payAmount) {
      if (data.addAmount) {
        finalAmount = parseInt(data.addAmount);
        status = "P";
      } else {
        finalAmount = 0;
      }
    } else {

      console.log(" data:", data);
      finalAmount -= parseInt(data.payAmount);
      if (data.addAmount) finalAmount += parseInt(data.addAmount);
      status = "P";
    }



    const postData = {
      dep_id: pandingRecord.dep_id,
      id: pandingRecord.id,
      createdAt: new Date(data.date).toISOString(),
      amount: finalAmount,
      inst_rate: data.interestRate,
      status,
      type: "payment",
      inst_amt: pRecord.interestAmount,
      payedDate: payDetails.date,
      days: pRecord.days,
      paid_amt: data.payAmount,
      t_date: new Date(),
      addAmount: data.addAmount,
      cInterestRate: payDetails.interestRate,
      info: `Payment of ₹${payedAmount} on ${dayjs(payDetails.date).format("DD-MM-YYYY")}`,
    }

    try {
      await postApiCall("dep-transactions/depPayment", postData);
    } catch (error) {
      console.error("Payment submission error:", error);
    }

    handleClose();
  };

  return (
    <BootstrapDialog maxWidth="lg" onClose={handleClose} open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }}>Payment</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: "absolute", right: 8, top: 8, color: "grey" }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ minWidth: "900px" }}>
        <Grid container spacing={3} alignItems="flex-start">

          {/* LEFT COLUMN: Date & Rate Settings */}
          <Grid item xs={3.5}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Calculation Settings
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <DatePickerComponent
                controlForm1={controlForm1}
                onBlur={handleSubmitForm1(updatePaymentDetails)}
                errorsForm1={errorsForm1}
                minDateRange={pandingRecord?.createdAt || null}
              />
              <Controller
                name="interestRate"
                control={controlForm1}
                rules={{ required: "Interest rate is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Interest Rate (%)"
                    type="number"
                    size="small"
                    onBlur={handleSubmitForm1(updatePaymentDetails)}
                    fullWidth
                    error={!!errorsForm1.interestRate}
                    helperText={errorsForm1.interestRate?.message}
                  />
                )}
              />
            </Box>
          </Grid>

          <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 1 }} />

          <Grid item xs={3.5} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Account Status
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">Principal Amount</Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>₹{pandingRecord?.amount}</Typography>

              <Typography variant="body2" color="textSecondary">Interest Amount</Typography>
              <Typography variant="h5" color="success.main" sx={{ mb: 2 }}>₹{pRecord?.interestAmount || 0}</Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="body2" color="textSecondary">Total Payable</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                ₹{pRecord?.totalPayAmount || 0}
              </Typography>
            </Box>
          </Grid>

          {/* RIGHT COLUMN: Payment Actions */}
          <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 1 }} />
          <Grid item xs sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Execute Payment
            </Typography>
            <Box component="form" onSubmit={handleSubmitForm1(handlePayment)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Controller
                name="payAmount"
                control={controlForm1}
                rules={{
                  required: "Payment amount is required",
                  min: { value: addAmount ? 0 : 1, message: "Min 1" },
                  max: { value: pRecord?.totalPayAmount, message: `Max: ${pRecord?.totalPayAmount}` },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount to Pay"
                    type="number"
                    size="small"
                    fullWidth
                    error={!!errorsForm1.payAmount}
                    helperText={errorsForm1.payAmount?.message}
                  />
                )}
              />

              {/* <FormControlLabel 
          control={<Switch checked={addAmount} onChange={() => setAddAmount(!addAmount)} />} 
          label="Add New Capital" 
        /> */}

              {addAmount && (
                <Controller
                  name="addAmount"
                  control={controlForm1}
                  rules={{ required: "Required", min: 1 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Additional Principal"
                      type="number"
                      size="small"
                      fullWidth
                      error={!!errorsForm1.addAmount}
                      helperText={errorsForm1.addAmount?.message}
                    />
                  )}
                />
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Confirm Payment
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

    </BootstrapDialog>
  );
}
