import * as React from "react";
import { styled } from "@mui/material/styles";


import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";

import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { getPendingTnks } from "../../api";
import { getDaysBetweenDates } from "../../utils/utils";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import DataGridComponent from "../../components/DataGrid/DataGridComponent";
import CreateForm from "../../components/CreateForm/CreateForm";
import { getCall } from "../../api";

export default function DipositorList() {
  const [tableData, setTableData] = React.useState([]);

  // Fetch data from API
  React.useEffect(() => {

    
    const fetchData = async () => {
      try {
        const response = await getCall('seller/getAllSellers')
          const data = await Promise.all(
            response.allSellers.map(async (item, index) => {
                      
              return {
                id: item.sellerId, // Ensure ID is unique
                sno: index + 1,
                name: item.name,
                village: item.village,
               

              };
            })
          );
            
          setTableData(data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Table Columns
  const columns = [
    { field: "sno", headerName: "S.No", flex: 0.5, minWidth: 50 },
    { field: "id", headerName: "ID", flex: 1, minWidth: 80 },
    { 
      field: "name", 
      headerName: "Seller Name", 
      flex: 1.5, 
      minWidth: 150,
      renderCell: (params) => (
        <MuiLink
          component={Link}
          to={`/app/sellerPage/${params.row.id}`}
          underline="hover"
        >
          {params.value}
        </MuiLink>
      ),
    },
    { field: "village", headerName: "Village", flex: 1, minWidth: 120 },
    
  ];

  return (
    <Card sx={{ maxWidth: "100%" }}>
      


<AppBar position="static">
          <Toolbar variant="dense">
            <AssignmentIndIcon color="white" />&nbsp;
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              {"Sellers"} List
            </Typography>
            <CreateForm />
          </Toolbar>
        </AppBar>
      

      <CardContent>
       <DataGridComponent tableData={tableData} columns={columns}  />
        {/* <Box
      sx={{
        position: "sticky",
        bottom: 0,
        background: "#fff",
        padding: 2,
        borderTop: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="body1">💰 Total Amount: {totalAmount}</Typography>
      <Typography variant="body1">📈 Interest: {totalInterest}</Typography>
      <Typography variant="body1">🟢 Grand Total: {grandTotal}</Typography>
    </Box> */}
      
      </CardContent>
    </Card>
  );
}
