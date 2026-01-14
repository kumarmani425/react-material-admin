import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";


const DataGridComponent = ({ columns, tableData, pageLink }) => {
  const navigate = useNavigate();
  const handleRowClick = (params) => {

    navigate(`/app/${pageLink}/${params.row.forumId}/${params.row.id}`)

  }
  return (
    <Paper style={{ height: 625, width: "100%" }}>
      <DataGrid
        rows={tableData}
        columns={columns}
        pageSize={10}
        onRowClick={pageLink && handleRowClick}
        rowsPerPageOptions={[5]}

        sx={{
          border: 0,

          cursor: 'pointer',
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