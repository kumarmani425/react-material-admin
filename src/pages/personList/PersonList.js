import * as React from "react";
import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import DataGridComponent from "../../components/DataGrid/DataGridComponent";
import CreateForm from "../../components/CreateForm/CreateForm";
import { getCall } from "../../api";
import { toCheckState, createState, getStates } from '../../nest_api';

export default function PersonList() {
  const [tableData, setTableData] = React.useState([]);

  React.useEffect(() => {

   
    const fetchData = async () => {
      try {
        // Adjust endpoint as needed
        const response = await  getStates('/person');
        console.log('Person data:', response);
        
        const data = await Promise.all(
          (response|| []).map((item, index) => {
            return {
              id: item.id,
              
              name: item.name,
              sName: item.sName,
              fName: item.fName,
              age: item.age,
              occupation: item.occupation,
              primaryPhone: item.phones?.[0]?.number || "N/A",
              primaryAddress: item.addresses?.[0]?.street || "N/A",
            };
          })
        );

        setTableData(data);
      } catch (error) {
        console.error("Error fetching persons:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    /* { field: "sno", headerName: "S.No", flex: 0.5, minWidth: 50 }, */
    { field: "id", headerName: "ID", flex: 1, minWidth: 80 },
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        console.log('params',params.row.id),
        <MuiLink component={Link} to={`/app/personPage/${params.row.id}`} underline="hover">
          {params.value}
        </MuiLink>
      ),
    },
    { field: "sName", headerName: "Surname", flex: 1, minWidth: 120 },
    { field: "fName", headerName: "Father's Name", flex: 1, minWidth: 150 },
    { field: "age", headerName: "Age", flex: 0.6, minWidth: 80 },
    { field: "occupation", headerName: "Occupation", flex: 1, minWidth: 140 },
    { field: "primaryPhone", headerName: "Primary Phone", flex: 1, minWidth: 140 },
    { field: "primaryAddress", headerName: "Primary Address", flex: 1.2, minWidth: 160 },
  ];

  return (
    <Card sx={{ maxWidth: "100%" }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <PersonIcon color="white" />&nbsp;
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Persons List
          </Typography>
          
        </Toolbar>
      </AppBar>

      <CardContent>
        <DataGridComponent tableData={tableData} columns={columns} />
      </CardContent>
    </Card>
  );
}