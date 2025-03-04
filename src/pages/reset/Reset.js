import React, { useState } from 'react';
import { Grid, CircularProgress, TextField as Input } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom'; // useNavigate replaces useHistory, useLocation for location info
// styles
import useStyles from './styles';
// logo
import logo from './logo.svg';
// context
import { useUserDispatch, resetPassword, authError } from '../../context/UserContext';
// components
import { Button, Typography } from '../../components/Wrappers';

function Reset() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const userDispatch = useUserDispatch();

  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [isLoading] = useState(false);

  const isPasswordValid = () => {
    return passwordValue && passwordValue === confirmPasswordValue;
  };

  const checkPassword = () => {
    if (!isPasswordValid()) {
      if (!passwordValue) {
        authError('Password field is empty')(userDispatch);
      } else {
        authError('Passwords are not equal')(userDispatch);
      }
      // This extra error call may be intended for resetting error state.
      authError()(userDispatch);
    }
  };

  const doReset = () => {
    // Get the token from URL query parameters using URLSearchParams and location.search
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      authError('There is no token')(userDispatch);
      return;
    }
    if (!isPasswordValid()) {
      checkPassword();
    } else {
      resetPassword(token, passwordValue, navigate)(userDispatch);
    }
  };

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>
          React Material Admin Full
        </Typography>
      </div>
      <div className={classes.customFormContainer}>
        <div className={classes.form}>
          <Input
            id="password"
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            margin="normal"
            placeholder="password"
            type="password"
            fullWidth
          />
          <Input
            id="confirmPassword"
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={confirmPasswordValue}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
            margin="normal"
            placeholder="Confirm Password"
            type="password"
            fullWidth
          />
          <div className={classes.formButtons}>
            {isLoading ? (
              <CircularProgress size={26} className={classes.loginLoader} />
            ) : (
              <Button
                disabled={
                  passwordValue.length === 0 ||
                  confirmPasswordValue.length === 0 ||
                  passwordValue !== confirmPasswordValue
                }
                onClick={() => doReset()}
                variant="contained"
                color="primary"
                size="large"
              >
                reset password
              </Button>
            )}
            <Button
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
              className={classes.forgetButton}
            >
              Back to login
            </Button>
          </div>
        </div>
        <Typography color="primary" className={classes.copyright}>
          2014-{new Date().getFullYear()}{' '}
          <a
            style={{ textDecoration: 'none', color: 'inherit' }}
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

export default Reset;