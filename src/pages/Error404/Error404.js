import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import Grid from '@mui/material/Grid'; // Default stable Grid in v7

export default function Error404() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={4} alignItems="center">
                    {/* Left Side: Text Content */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            404
                        </Typography>
                        <Typography variant="h4" gutterBottom>
                            Oops! Page not found.
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            The page you are looking for might have been removed,
                            had its name changed, or is temporarily unavailable.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            href="/"
                            sx={{ textTransform: 'none', px: 4 }}
                        >
                            Back to Home
                        </Button>
                    </Grid>

                    {/* Right Side: Visual Illustration */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <img
                            src="illustrations.popsy.co"
                            alt="404 Illustration"
                            style={{ width: '100%', maxWidth: '400px' }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
