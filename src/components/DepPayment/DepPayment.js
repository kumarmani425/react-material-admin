import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import {
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
import DatePickerComponent from "../DatePicker/DatePicker";
import { el } from "date-fns/locale";

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
    interestRate: pandingRecord?.interestRate || 0,
  });

  React.useEffect(() => {
    if (toOpen) {
      setOpen(true);
      setPRecord(pandingRecord);
      setPayDetails({
        date: new Date().toISOString(),
        interestRate: pandingRecord?.interestRate || 0,
      });
      calculateInterest(
        pandingRecord?.pAmount,
        pandingRecord?.interestRate,
        pandingRecord?.createdDate,
        new Date().toISOString()
      );
    }
  }, [toOpen]);

  const {
    handleSubmit: handleSubmitForm1,
    control: controlForm1,
    formState: { errors: errorsForm1 },
    reset: reset1,
  } = useForm({ defaultValues: { date: new Date(), interestRate: "12" } });

  const {
    handleSubmit: handleSubmitForm2,
    control: controlForm2,
    formState: { errors: errorsForm2 },
    setValue: setValue2,
    reset: reset2,
  } = useForm({ defaultValues: { payAmount: null, addAmount: null } });

  const handleClose = () => {
    setOpen(false);
    onClose?.();
    reset1();
    reset2();
  };

  const updatePaymentDetails = (data) => {
    console.log('updatePayment',data)
    setPayDetails({
      ...data,
      date: new Date(data.date).toISOString(),
      interestRate: data.interestRate,
    });
    calculateInterest(
      pandingRecord.pAmount,
      data.interestRate,
      pandingRecord.createdDate,
      data.date
    );
  };

  const calculateInterest = (pAmount, interestRate, startDate, endDate) => {
    const days = getDaysBetweenDates(startDate, endDate);
    const interestAmount = Math.round((pAmount * parseInt(interestRate) * days) / 36500);
    setPRecord((prev) => ({
      ...prev,
      interestAmount,
      totalPayAmount: pAmount + interestAmount,
      days,
    }));
  };

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

      
      finalAmount -= parseInt(data.payAmount);
      if (data.addAmount) finalAmount += parseInt(data.addAmount);
      status = "P";
    }
console.log("handlePayment",payedAmount, finalAmount)
    try {
      await depPayment("dipositor/depPayment", {
        depId: pandingRecord.depId,
        tId: pandingRecord.tId,
        createdDate: payDetails.date,
        pAmount: finalAmount,
        interestRate: pandingRecord.interestRate,
        status,
        interestAmount: pRecord.interestAmount,
        payedDate: payDetails.date,
        days: pRecord.days,
        paidAmount: data.payAmount,
        addAmount: data.addAmount,
        cInterestRate: payDetails.interestRate,
      });
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
      <DialogContent dividers>
        <Box
          component="form"
          /* onSubmit={handleSubmitForm1(updatePaymentDetails)} */
          sx={{
            "& > :not(style)": { m: 2, width: "25ch" },
            border: 1,
            borderColor: "grey.500",
            borderRadius: 1,
          }}
        >
          <DatePickerComponent
            controlForm1={controlForm1}
            onBlur={handleSubmitForm1(updatePaymentDetails)}
            errorsForm1={errorsForm1}
            minDateRange={pandingRecord?.createdDate || null}
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
          {/* <Button type="submit" variant="contained" color="primary">
            Submit
          </Button> */}
        </Box>

        <Typography align="center" variant="subtitle1" gutterBottom>
          <b>
            Principal Amount:{" "}
            <span style={{ color: "green" }}>{pandingRecord?.pAmount}</span> | Interest Amount:{" "}
            <span style={{ color: "green" }}>{pRecord?.interestAmount}</span> | Total Amount:{" "}
            <span>{pRecord?.totalPayAmount}</span>
          </b>
        </Typography>

        <Box component="form" onSubmit={handleSubmitForm2(handlePayment)}>
          <Box align="center"  sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
            <Controller
              name="payAmount"
              control={controlForm2}
              rules={{
                required: "Payment amount is required",
                min: { value: addAmount ? 0 : 1, message: "Minimum Payment Amount is 1" },
                max: { value: pRecord?.totalPayAmount, message: `Max Amount: ${pRecord?.totalPayAmount}` },
              }}
              render={({ field }) => (
                <TextField {...field} label="Pay Amount" type="number" size="small"  fullWidth  
                error={!!errorsForm2.payAmount}
                helperText={errorsForm2.payAmount?.message} />
              )}
            />
          </Box>

          <Box align="center" >
            <FormControlLabel control={<Switch  checked={addAmount} onChange={() => setAddAmount(!addAmount)} />} label="Add Amount" />
          </Box>

          {addAmount && (
            <Box align="center"  sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
              <Controller
                name="addAmount"
                control={controlForm2}
                rules={{ required: "Additional amount is required", min: 1 }}
                render={({ field }) => (
                  <TextField {...field} label="Add Amount" type="number" size="small" fullWidth 
                  error={!!errorsForm2.addAmount}
                  helperText={errorsForm2.addAmount?.message}
                  />
                )}
              />
            </Box>
          )}
<Box align="right"  sx={{ '& .MuiTextField-root': { p: 1, width: '25ch' } }} >
          <Divider /> 
          </Box>
          <Box align="right"  sx={{ '& .MuiTextField-root': { p: 1, width: '25ch' } }} >
            <Button type="submit"  variant="contained" color="primary">
              Payment
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
}
