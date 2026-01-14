import React from 'react';
import {
  TextField, Button, MenuItem, Box, Typography, Container, Paper, Grid, Divider
} from '@mui/material';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import { useForm } from "react-hook-form";
import { postApiCall, getApiCallWithParams } from '../../nest_api';
import NotificationContext from "../../store/alert-context";
import { useContext } from "react";


const ForumCreatePage = () => {
  const alertCtx = useContext(NotificationContext);
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      location: '',
      status: 'active',
    }
  });

  const onSubmit = async (data) => {
    console.log('Submitting Data:', data);
    try {
      // In 2026, ensure your API utility is awaited for proper error handling
      const res = await postApiCall('forum/create', data);
      console.log('Success:', res);
      alertCtx.setNotification({ message: res.message, type: 'success' })
      reset(); // Clear form after success
    } catch (err) {
      console.error('Submission Error:', err);
      alertCtx.setNotification({ message: 'Failed to create forum. Please try again.', type: 'error' })
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddHomeWorkIcon color="primary" /> Create New Forum
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* The button must be INSIDE this form tag to work */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Forum Name"
                variant="outlined"
                {...register("name", {
                  required: "Forum name is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                  validate: async (value) => {
                    if (!value) return true;
                    try {
                      const res = await getApiCallWithParams(`/forum/forumNameValidation/${encodeURIComponent(value)}`);
                      if (res && (res.exists === true || res.user)) {
                        return 'forum Name already Used';
                      }
                      return true;
                    } catch (err) {
                      return 'Error validating user ID';
                    }
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Location"
                variant="outlined"
                {...register("location", {
                  required: "Location is required",
                  minLength: { value: 2, message: "Minimum 2 characters" }
                })}
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Status"
                defaultValue="active"
                {...register("status", { required: "Status is required" })}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>

            {/* Submit Button placed INSIDE the Grid/Form */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isSubmitting} // Prevents double submission
              >
                {isSubmitting ? "Creating..." : "Create Forum"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ForumCreatePage;
