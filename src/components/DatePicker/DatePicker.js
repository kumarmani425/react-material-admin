import React from "react";
import { Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DatePickerComponent = ({ controlForm1, errorsForm1, minDateRange, onBlur }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name="date"
        control={controlForm1}
        rules={{ required: "Date is required" }}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="Date Picker"
            value={field.value ? dayjs(field.value) : null}
            maxDate={dayjs()}
            minDate={minDateRange ? dayjs(minDateRange) : undefined}
            
            onChange={(newValue) => {
              field.onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
              onBlur()
            }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
                error: !!errorsForm1?.date,
                helperText: errorsForm1?.date?.message,
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
