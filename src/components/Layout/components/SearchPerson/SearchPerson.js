import React, { use, useEffect, useState } from "react";
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
    Autocomplete,
    TextField,
    CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { getApiCall, getApiCallWithParams } from "../../../../nest_api";
import { BnsPersonProfile } from "../../../BnsPersonProfile/BnsPersonProfile"; // Ensure getApiCall is imported

const SuearchPerson = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    console.log("SearchPerson type from URL:", type);

    const [query, setQuery] = useState("");
    const [persons, setPersons] = useState([]);
    const [personData, setPersonData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Fetch all persons on component load for the dropdown option
    useEffect(() => {
        const fetchPersons = async () => {
            try {
                if (type === 'buyer') {
                    const resp = await getApiCallWithParams(`/bns-person/findPersonsWithOutBuyer`);
                    const data = resp?.data || resp;
                    setPersons(Array.isArray(data) ? data : []);
                } else if (type === 'trader') {
                    const resp = await getApiCall('/bns-person/findPersonsWithOutTrader');
                    // Ensure we handle different possible response structures
                    const data = resp?.data || resp;
                    setPersons(Array.isArray(data) ? data : []);
                }
            } catch (e) {
                console.error("Failed to fetch persons for autocomplete", e);
            }
        };
        fetchPersons();
    }, []);

    useEffect(() => {
        console.log("Query changed:", query);
    }, [query]);

    useEffect(() => {
        if (query.trim() === "") {
            setPersonData(undefined);
        }
    }, [query]);

    const onSearch = async () => {
        setPersonData(undefined);
        setError(null);
        if (!query.trim()) return;

        setLoading(true);
        try {
            // Search for the specific person details by name
            const resp = await getApiCallWithParams(`/person/search?name=${query}`);
            const data = resp?.data || resp?.person || resp;

            if (data && (Array.isArray(data) ? data.length > 0 : true)) {
                setPersonData(Array.isArray(data) ? data[0] : data);
            } else {
                setPersonData(null);
            }
        } catch (e) {
            setPersonData(null);
            setError("Search failed or person not found.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ width: "100%" }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <SearchIcon sx={{ color: "#fff" }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
                        Search {type} by Name
                    </Typography>
                </Toolbar>
            </AppBar>

            <CardContent>
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={10} md={8} lg={6}>
                            <Autocomplete
                                freeSolo
                                options={persons}
                                // Display 'name' property in the dropdown list
                                getOptionLabel={(option) =>
                                    typeof option === 'string' ? option : (option.name || "")
                                }
                                inputValue={query}
                                onInputChange={(event, newInputValue) => {
                                    setQuery(newInputValue);
                                }}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        console.log("Selected value:", newValue);
                                        setPersonData(newValue); // Set the selected person data
                                        const val = typeof newValue === 'string' ? newValue : newValue.name;
                                        setQuery(val);
                                    }
                                }}
                                // Optional: Custom rendering to show more info in the dropdown list
                                renderOption={(props, option) => (
                                    <Box component="li" {...props} key={option.id || option.aadhar}>
                                        {option.name} {option.aadhar ? `(${option.aadhar})` : ""}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search By Name"
                                        placeholder="Type a name..."
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                    {/* {!query && <Button
                                                        onClick={onSearch}
                                                        disabled={!query.trim() || loading}
                                                        variant="contained"
                                                        sx={{ ml: 1 }}
                                                    >
                                                        Search
                                                    </Button>} */}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>
                {error && (
                    <Box sx={{ mt: 2 }}><Alert severity="error">{error}</Alert></Box>
                )}

                {/* Create Person Button if query has length but no person was found */}
                {query.trim().length > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Button
                            component={RouterLink}
                            to={personData ? `/app/createBnsPerson?pId=${personData.id}&type=${type}&isEdit=true` : `/app/createBnsPerson?name=${query}&type=${type}`}
                            variant="contained"
                            color="success"
                        >
                            {`Create New ${type}: ${query}`}
                        </Button>
                    </Box>
                )}
            </CardContent>
            {personData && <BnsPersonProfile userData={personData} />}
        </Card>
    );
};

export default SuearchPerson;
