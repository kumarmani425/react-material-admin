import { Box, Typography } from "@mui/material";

const Fieldset = ({ title, children, ...props }) => {
  return (
    <Box
      component="fieldset" // Renders as an HTML <fieldset> element
      sx={{
        border: '1px solid',
        borderColor: 'grey.400', // Example border color
        borderRadius: 1, // Example border radius
        padding: 2, // Example padding
      }}
      {...props}
    >
      {title && (
        <Typography
          component="legend" // Renders as an HTML <legend> element
          sx={{
            paddingX: 1, // Add horizontal padding for spacing around the text
            color: 'text.primary', // Example text color
          }}
        >
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};
export default Fieldset;