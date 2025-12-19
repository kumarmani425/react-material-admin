import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { toCheckState, getStates } from '../../../nest_api';
import { useParams } from "react-router-dom";

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index} role="tabpanel" aria-labelledby={`tab-${index}`}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

const samplePerson = {
  id: 5,
  name: "kumara manikanta",
  sName: "repuri",
  fName: "suryanarayana",
  age: 48,
  aadhar: "123456789021",
  voterId: "WQE6546547",
  driving_licence: null,
  religion: "Hindu",
  occupation: "Software Engineer",
  dPhoneId: 6,
  dAddressId: 2,
  createdAt: "2025-10-28T10:58:22.000Z",
  updatedAt: "2025-10-28T10:58:22.000Z",
  phones: [
    {
      id: 6,
      personId: 5,
      number: "9491716511",
      type: "home",
      countryCode: null,
      isPrimary: true,
      isActive: true,
      createdAt: "2025-10-28T10:58:22.000Z",
      updatedAt: "2025-10-28T10:58:22.000Z",
    },
  ],
  addresses: [
    {
      id: 2,
      personId: 5,
      type: "home",
      villageId: 13,
      street: "sdfasfas",
      landmark: "sdafasdfasd",
      isPrimary: true,
      isActive: true,
      createdAt: "2025-10-28T10:58:22.000Z",
      updatedAt: "2025-10-28T10:58:22.000Z",
    },
  ],
};

const fmt = (d) => (d ? new Date(d).toLocaleString() : "—");

const PersonPopulate = ({ preloadedPerson = null }) => {
  const [personRes, setPersonRes] = useState(null);
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    // If parent passed preloadedPerson, use it and skip fetching.
    if (preloadedPerson) {
      setPersonRes(preloadedPerson);
      return;
    }

    if (!id) return;
    let mounted = true;

    const fetchPerson = async () => {
      try {
        // optional list fetch (kept for parity with previous code)
        await getStates("/person").catch(() => null);
      } catch (e) {
        // ignore list errors
      }

      try {
        const detailsResp = await toCheckState(`/person/${id}`);
        const personData = detailsResp?.data || detailsResp?.person || detailsResp;
        if (mounted) setPersonRes(personData);
      } catch (e) {
        console.error("Error fetching person details", e);
      }
    };

    fetchPerson();
    return () => {
      mounted = false;
    };
  }, [id, preloadedPerson]);

  const person = personRes || samplePerson;

  return (
    <Card sx={{ maxWidth: 1000, margin: "24px auto", position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 8, right: 12, bgcolor: 'primary.main', color: 'primary.contrastText', px: 1.25, py: 0.5, borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>{person?.name || 'Person'}</Typography>
      </Box>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} aria-label="person tabs">
            <Tab label="Person Info" id="tab-0" />
            <Tab label="Phones" id="tab-1" />
            <Tab label="Addresses" id="tab-2" />
          </Tabs>
        </Box>

        <TabPanel value={tab} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2">Full Name</Typography>
              <Typography variant="body1">
                {person.name} {person.sName} {person.fName}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={4}>
              <Typography variant="subtitle2">Age</Typography>
              <Typography variant="body1">{person.age}</Typography>
            </Grid>

            <Grid item xs={6} sm={4}>
              <Typography variant="subtitle2">Occupation</Typography>
              <Typography variant="body1">{person.occupation}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2">Aadhar</Typography>
              <Typography variant="body1">{person.aadhar || "—"}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2">Voter ID</Typography>
              <Typography variant="body1">{person.voterId || "—"}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2">Driving Licence</Typography>
              <Typography variant="body1">{person.driving_licence || "—"}</Typography>
            </Grid>

            <Grid item xs={6} sm={4}>
              <Typography variant="subtitle2">Religion</Typography>
              <Typography variant="body1">{person.religion}</Typography>
            </Grid>

            <Grid item xs={6} sm={4}>
              <Typography variant="subtitle2">Primary Phone ID</Typography>
              <Typography variant="body1">{person.dPhoneId ?? "—"}</Typography>
            </Grid>

            <Grid item xs={6} sm={4}>
              <Typography variant="subtitle2">Primary Address ID</Typography>
              <Typography variant="body1">{person.dAddressId ?? "—"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Created At</Typography>
              <Typography variant="body1">{fmt(person.createdAt)}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Updated At</Typography>
              <Typography variant="body1">{fmt(person.updatedAt)}</Typography>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" aria-label="phones table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Primary</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {person.phones?.length ? (
                  person.phones.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.number}</TableCell>
                      <TableCell>{p.type}</TableCell>
                      <TableCell>{p.isPrimary ? "Yes" : "No"}</TableCell>
                      <TableCell>{p.isActive ? "Yes" : "No"}</TableCell>
                      <TableCell>{fmt(p.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography align="center">No phones available</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tab} index={2}>
          {person.addresses?.length ? (
            <List>
              {person.addresses.map((a) => (
                <React.Fragment key={a.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`${a.type?.toUpperCase() || "Address"} (ID: ${a.id})`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            Street:{" "}
                          </Typography>
                          {a.street || "—"}
                          <br />
                          <Typography component="span" variant="body2" color="text.primary">
                            Landmark:{" "}
                          </Typography>
                          {a.landmark || "—"}
                          <br />
                          <Typography component="span" variant="body2" color="text.primary">
                            Village ID:{" "}
                          </Typography>
                          {a.villageId ?? "—"}
                          <br />
                          <Typography component="span" variant="body2" color="text.primary">
                            Primary:{" "}
                          </Typography>
                          {a.isPrimary ? "Yes" : "No"}{" "}
                          <Typography component="span" sx={{ mx: 1 }}>
                            •
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary">
                            Active:{" "}
                          </Typography>
                          {a.isActive ? "Yes" : "No"}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography align="center">No addresses available</Typography>
          )}
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default PersonPopulate;