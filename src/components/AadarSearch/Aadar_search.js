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
import { getApiCallWithParams } from "../../nest_api";
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
      const resp = await getApiCallWithParams(`/person/aadhar/${q}`);
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
                  maxValue={12}
                  onChange={(e) => {// allow digits only and limit to 12 characters
                    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 12);
                    setQuery(digitsOnly);
                  }}
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
                  disabled={query.length != 12 || loading}
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

              to={`/app/createPerson?aadhar=${query}&type=${type}`}

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