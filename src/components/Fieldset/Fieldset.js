/* import { Box, Typography } from "@mui/material";

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
          variant="h5"
          sx={{
            paddingX: 1, // Add horizontal padding for spacing around the text
            color: 'text.primary',
            // Example text color
          }}
        >
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};
export default Fieldset; */
import { Box, Typography } from "@mui/material";
const STATUS_CONFIG = {
  PP: { color: '#ff9800', label: 'Pending', bgColor: '#fff3e0' },
  C: { color: '#2e7d32', label: 'Open', bgColor: '#e8f5e9' },
  P: { color: '#d21919', label: 'Closed', bgColor: '#e3f2fd' },
  DEFAULT: { color: '#9e9e9e', label: 'Unknown', bgColor: '#f5f5f5' }
};

const Border_config = {
  PP: { borderLeft: '6px solid #ff9800', label: 'Pending', bgColor: '#fff3e0' },
  C: { borderLeft: ' 6px solid #2e7d32', label: 'Open', bgColor: '#e8f5e9' },
  P: { borderLeft: '6px solid #d21919', label: 'Closed', bgColor: '#e3f2fd' },
  DEFAULT: { borderLeft: ' 6px solid #9e9e9e', label: 'Unknown', bgColor: '#f5f5f5' }
}
const Fieldset = ({ border, title, status, children, isPayment = true, ...props }) => {
  console.log("Fieldset status", status);

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DEFAULT;
  const borderConfig = Border_config[border]
  return (
    <Box
      component="fieldset" // Renders as an HTML <fieldset> element
      sx={{
        border: '1px solid', // Example border style
        borderColor: `${config.color}`, // Example border color
        borderRadius: border ? 2 : 1, // Example border radius
        boxShadow: status && `0 0 4px ${config.color}, 0 0 8px ${config.color}40`,
        borderLeft: border && `${borderConfig.borderLeft}`,
        pb: border && 0
      }}
      {...props}
    >
      {title && (
        <Typography
          component="legend" // Renders as an HTML <legend> element
          variant="h6"
          sx={{
            paddingX: 1, // Add horizontal padding for spacing around the text
            color: 'text.primary',
            backgroundColor: status && 'white'
            // Example text color
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