import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const VillageLayout = ({children,title}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <Container maxWidth="sm" key={child.key}> {/* Use the key from the child */}
          <Box
            sx={{
             
              p: 3,
              border: "1px solid #ccc",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>{title}</Typography>
            
            {child}
          </Box>
        </Container>
      ))}
    </>
  );
};

export default VillageLayout;