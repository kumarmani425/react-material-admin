import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import OrderDetailsModal from "../OrderForm/OrderDetailsModal/OrderDetailsModal";
import PaymentPopUI from "../Trader/PaymentPopUI";


const DataGridComponent = ({ columns, tableData, pageLink, isOpenModal = false }) => {
  const navigate = useNavigate();
  const [orderDetailsOpen, setOrrderDetailsOpen] = useState(false)
  const [items, setItems] = useState([])
  console.log("tableData :", tableData)
  const orderDetModalClose = () => {
    console.log("orderDetModalClose")
    setOrrderDetailsOpen(false)
    setItems([])
  }

  const handleRowClick = (params) => {
    console.log("handleRowClick", params)

    if (isOpenModal) {
      setOrrderDetailsOpen(true)
      setItems(params.row.orderDetails || [])

    } else {

      navigate(`/app/${pageLink}/${params.row.forumId}/${params.row.id}`)
    }

  }


  return (
    <Paper style={{ height: 625, width: "100%" }}>

      <OrderDetailsModal isOpen={orderDetailsOpen} items={items} closeModal={() => orderDetModalClose()} />
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
          "& .MuiDataGrid-row.close": {
            backgroundColor: "#d4edda", // Green
          },
          "& .MuiDataGrid-row.pending": {
            backgroundColor: "#fdd1d5",
            border: '#b70012'// Red
          },
          "& .MuiDataGrid-row.partPaid": {
            backgroundColor: "#f4ce9c", // Red
          }
        }}
        getRowClassName={(params) => {
          if (params.row.status == 'C') return "close";
          if (params.row.status == 'P') return "pending";
          if (params.row.status == 'PP') return "partPaid"
          return "";
        }}
        disableSelectionOnClick
      />
    </Paper>
  );
};

export default DataGridComponent;