import React from "react";
import { Grid } from "@material-ui/core";
// 1. Import useNavigate instead of withRouter
import { useNavigate } from "react-router-dom"; 

// ... (keep your other component imports)

const Pages = () => {
  // 2. Initialize the navigate hook
  const navigate = useNavigate(); 

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* ... (keep your existing Widget and Typography JSX) */}
          
          <Button
            variant={"contained"}
            color={"primary"}
            // 3. Use navigate instead of props.navigate or props.history.push
            onClick={() => navigate("/app/dashboard")} 
          >
            Demo
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

// 4. Export the component directly (without withRouter)
export default Pages;
