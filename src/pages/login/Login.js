import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
// 1. Remove withRouter, add useLocation and useSearchParams
import { useLocation, useSearchParams } from "react-router-dom"; 
import classnames from "classnames";
import { useForm } from "react-hook-form";
import useStyles from "./styles";
import { DevTool } from "@hookform/devtools";
import { useUserDispatch } from "../../context/UserContext"; 
import { useDispatch } from "react-redux";
import LoginPage from "../login_page/LoginPage";
// logo
import logo from './logo.png';

// ... (keep logo and other component imports)

function Login() { // 2. Remove props from arguments
  const classes = useStyles();
  
  
  // 3. Use hooks to replace props.location logic
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTabId, setActiveTabId] = useState(0);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    // 4. Use searchParams hook instead of manual URLSearchParams(props.location.search)
    const token = searchParams.get("token");
    /* if (token) {
      receiveToken(token, userDispatch);
      doInit()(userDispatch);
    } */
  }, [searchParams]); // Added searchParams as dependency

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt='logo' className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>
          Sriphala Mitra
        </Typography>
      </div>
      {/* ... (keep existing JSX) */}
      <div className={!isForgot ? classes.formContainer : classes.customFormContainer}>
        <div className={classes.form}>
          {isForgot ? (
            <div>
              {/* ... (Forgot Password JSX) */}
            </div>
          ) : (
            <>
              <Tabs
                value={activeTabId}
                onChange={(e, id) => setActiveTabId(id)}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Login" classes={{ root: classes.tab }} />
                <Tab label="New User" classes={{ root: classes.tab }} />
              </Tabs>
              {activeTabId === 0 && (<LoginPage />)}
              
            </>
          )}
        </div>
        <Typography color="primary" className={classes.copyright}>
          2014-{new Date().getFullYear()}{" "}
          <a
            style={{ textDecoration: "none", color: "inherit" }}
            href="https://flatlogic.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Flatlogic
          </a>
          , LLC. All rights reserved.
        </Typography>
      </div>
    </Grid>
  );
}

// 5. Export directly without withRouter
export default Login; 
