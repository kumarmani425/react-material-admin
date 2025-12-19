import React, { useState, useEffect } from "react";
import { CircularProgress, TextField, Typography } from "@mui/material";
import { useNavigate , useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useUserDispatch, loginUser, receiveToken, doInit } from "../../context/UserContext";
import { Button } from "../../components/Wrappers";
import useStyles from "./styles";
import Alert from "@mui/lab/Alert";

function LoginPage() {
  const navigate   = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const userDispatch = useUserDispatch();
  const { register, handleSubmit, formState: { errors }, control } = useForm();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      receiveToken(token, userDispatch);
      doInit()(userDispatch);
    }
  }, [location.search, userDispatch]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8888/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.userId, password: data.password }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Login failed. Please try again.");
      }

      // Store token securely (prefer HTTP-only cookies in real apps)
      localStorage.setItem("token", resData.token);
      localStorage.setItem("user", JSON.stringify(resData.user));
      localStorage.setItem("theme", "default");

      navigate("/app/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.form}>
      <Typography variant="h1" className={classes.greeting}>Welcome Back!</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="userId"
          className={classes.Input}
          {...register("userId", { required: "User ID is required" })}
          margin="normal"
          placeholder="User ID"
          type="text"
          fullWidth
          error={!!errors.userId}
          helperText={errors.userId?.message}
        />
        <TextField
          id="password"
          className={classes.Input}
          {...register("password", { required: "Password is required" })}
          margin="normal"
          placeholder="Password"
          type="password"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        {isLoading ? (
          <CircularProgress size={26} className={classes.loginLoader} />
        ) : (
          <Button type="submit" variant="contained" color="primary" size="large">
            Login
          </Button>
        )}
      </form>
      <DevTool control={control} />
    </div>
  );
}

export default LoginPage;
