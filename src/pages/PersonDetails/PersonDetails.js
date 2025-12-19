import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

import { CircularProgress, Box, Typography } from "@mui/material";
import { toCheckState } from "../../nest_api";
import PersonPopulate from "./PersonPopulate/PersonPopulate";

const PersonDetails = () => {
  const { id } = useParams();
  const [personData, setPersonData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const fetchPerson = async () => {
      setLoading(true);
      try {
        const resp = await toCheckState(`/person/${id}`);
        const data = resp?.data || resp?.person || resp;
        if (mounted) setPersonData(data);
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPerson();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!id) return <Navigate to="/app/personList" />;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Error loading person: {String(error)}</Typography>
      </Box>
    );
  }

  return <PersonPopulate preloadedPerson={personData} />;
};

export default PersonDetails;