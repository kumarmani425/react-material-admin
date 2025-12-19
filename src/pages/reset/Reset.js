import React, { useState } from 'react';
import { Grid, CircularProgress, TextField as Input } from '@mui/material';
// 1. Correct imports: add useSearchParams and useParams, remove 'params'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

// styles
import useStyles from './styles';
import logo from './logo.svg';

// context
import { useUserDispatch, resetPassword, authError } from '../../context/UserContext';

// components
import { Button, Typography } from '../../components/Wrappers';

function Reset() {
  const classes = useStyles();
  const navigate = useNavigate(); // v6 navigation hook
  const [searchParams] = useSearchParams(); // v6 hook for query strings
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
    }
  };

  const doReset = () => {
    // 2. Get token using useSearchParams hook
    const token = searchParams.get('token');
    
    if (!token) {
      authError('There is no token')(userDispatch);
      return;
    }

    if (!isPasswordValid()) {
      checkPassword();
    } else {
      // Pass the navigate function to your context action
      resetPassword(token, passwordValue, navigate)(userDispatch);
    }
  };

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt='logo' className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>
          React Material Admin Full
        </Typography>
      </div>
      <div className={classes.customFormContainer}>
        <div className={classes.form}>
          <Input
            id='password'
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            margin='normal'
            placeholder='password'
            type='password'
            fullWidth
          />
          <Input
            id='confirmPassword'
            value={confirmPasswordValue}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
            margin='normal'
            placeholder='Confirm Password'
            type='password'
            fullWidth
          />
          <div className={classes.formButtons}>
            {isLoading ? (
              <CircularProgress size={26} className={classes.loginLoader} />
            ) : (
              <Button
                disabled={!isPasswordValid() || passwordValue.length === 0}
                onClick={doReset}
                variant='contained'
                color='primary'
                size='large'
              >
                reset password
              </Button>
            )}
            <Button
              color='primary'
              size='large'
              // 3. Changed history.push to navigate
              onClick={() => navigate('/login')}
              className={classes.forgetButton}
            >
              Back to login
            </Button>
          </div>
        </div>
        <Typography color='primary' className={classes.copyright}>
          2014-{new Date().getFullYear()} Flatlogic, LLC.
        </Typography>
      </div>
    </Grid>
  );
}

// 4. Export without withRouter
export default Reset;
