import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Clear } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import DataGridComponent from "../../components/DataGrid/DataGridComponent";
import { getCall } from "../../api";
import { toCheckState } from "../../nest_api";
import PersonPopulate from "../../pages/PersonDetails/PersonPopulate/PersonPopulate";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import { useParams } from "react-router-dom";

const AadharSearch = () => {
   const { type } = useParams();

  const [query, setQuery] = useState("");
  const [persons, setPersons] = useState([]);
  const [personData, setPersonData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {

    if (query.length !== 12) {
      console.log("Resetting personData due to invalid query length");
      setPersonData(undefined);
      setLoading(false);
    }


  }, [query]);

    
  const onSearch = async () => {
    setPersonData(undefined);
    setError(null);
    const q = (query || "").trim();
    if (!q) {
      setResults(persons);
      setPersonData(undefined);
      return;
    }

    setLoading(true);
    try {
      const resp = await toCheckState(`/person/aadhar/${q}`);
      const data = resp?.data || resp?.person || resp;
      if (data) {
        setPersonData(data);
        setResults(Array.isArray(data) ? data : [data]);
        setLoading(false);
        return;
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || String(e);
      setPersonData(null);
      console.warn("Server aadhar search failed, falling back to client filter", msg);
      setError(msg);
    }

    
  };

  const columns = [
    { field: "sno", headerName: "S.No", flex: 0.4, minWidth: 50 },
    { field: "id", headerName: "ID", flex: 0.8, minWidth: 80 },
    { field: "name", headerName: "Name", flex: 1.5, minWidth: 150 },
    { field: "aadhar", headerName: "Aadhar", flex: 1, minWidth: 150 },
    { field: "age", headerName: "Age", flex: 0.6, minWidth: 80 },
    { field: "occupation", headerName: "Occupation", flex: 1, minWidth: 140 },
    { field: "primaryPhone", headerName: "Primary Phone", flex: 1, minWidth: 140 },
    { field: "primaryAddress", headerName: "Primary Address", flex: 1.2, minWidth: 160 },
  ];

  const personTypelist = {
    createDipositor: "Depositor",
    createUser: "User",
    createSeller: "Seller",

  }

  const rows = results.map((p, i) => ({
    id: p.id,
    sno: i + 1,
    name: p.name,
    aadhar: p.aadhar || "N/A",
    age: p.age,
    occupation: p.occupation,
    primaryPhone: p.phones?.[0]?.number || "N/A",
    primaryAddress: p.addresses?.[0]?.street || "N/A",
  }));

  return (
    <Card sx={{ width: "100%" }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <SearchIcon sx={{ color: "#fff" }} />
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            Aadhar Search
          </Typography>
        </Toolbar>
      </AppBar>

      <CardContent>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <Grid container justifyContent="center">
            <Grid
              item
              xs={12}
              sm={10}
              md={8}
              lg={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: 600,
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  onSearch();
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search By Aadhar"
                  value={query}
                  maxLength={12}
                  maxValue  ={12}
                  onChange={(e) => {// allow digits only and limit to 12 characters
      const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 12);
      setQuery(digitsOnly);}}
                  inputProps={{ "aria-label": "search by aadhar" }}
                />
                {query.length > 0 && (
                  <IconButton
                    onClick={() => {
                      setQuery("");
                      setResults(persons);
                      setPersonData(null);
                      setError(null);
                    }}
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="clear"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  onClick={onSearch}
                  disabled={query.length != 12 ||loading}
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                 <SearchIcon color={query.length != 12 || loading ? "disabled" : "inherit"} />
                </IconButton>
              </Paper>
            </Grid>
          </Grid>
        </Box>


        {/* Show person populate when server returned a single person */}
        {personData ? <PersonPopulate preloadedPerson={personData} /> : null}

        {/* Show error as MUI Alert */}
        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {String(error)}
            </Alert>
          </Box>
        )}

        
        {/* Create Depositor button */}
        {query.length === 12 && personData === null && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              component={RouterLink}
              
              to = {`/app/createPerson?aadhar=${query}&type=${type}`}
              
              variant="contained"
              color="primary"
              sx={{ minWidth: 160 }}
            >
              {`Create ${type}`}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AadharSearch;