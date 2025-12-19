import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";


const DataGridComponent = ({columns, tableData }) => {
  return (
    <Paper style={{ height: 625, width: "100%" }}>
      <DataGrid
        rows={tableData}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        sx={{
            border: 0,
            
            "& .MuiDataGrid-row": {
              backgroundColor: "white",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f1f1f1",
            },
            "& .MuiDataGrid-row.high-amount": {
              backgroundColor: "#d4edda", // Green
            },
            "& .MuiDataGrid-row.low-amount": {
              backgroundColor: "#f8d7da", // Red
            },
          }}
          getRowClassName={(params) => {
            if (params.row.status == 'P') return "high-amount";
            if (params.row.status == 'C') return "low-amount";
            return "";
          }}
        disableSelectionOnClick
      />
    </Paper>
  );
};

export default DataGridComponent;