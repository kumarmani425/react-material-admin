import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { enUS } from "date-fns/locale";
import { Box, Button, Popper, ClickAwayListener, TextField } from "@mui/material";
import { format } from "date-fns";

export default function MyDatePicker({selectData}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const anchorRef = useRef(null);

useEffect(() => { 
  
  
  selectData(state)
  }, [state]);

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      {/* Input Field to Show Selected Dates */}
      <TextField
        size="small"
        inputRef={anchorRef}
        value={`${format(state[0].startDate, "yyyy-MM-dd")} - ${format(state[0].endDate, "yyyy-MM-dd")}`}
        onClick={() => setOpen(true)}
        sx={{ width: "205px", cursor: "pointer", color: "white", backgroundColor: "white", borderRadius: 1 }}
        readOnly
      />

      {/* Popper for DateRangePicker */}
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end">
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box sx={{ bgcolor: "background.paper", boxShadow: 3, borderRadius: 2 }}>
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {setState([item.selection]); console.log('item',item) }}
              moveRangeOnFirstSelection={false}
              ranges={state}
              locale={enUS}
              
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <Button size="small" onClick={() => setOpen(false)}>Close</Button>
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
