import React, { useEffect } from 'react';
import { useUserDispatch, verifyEmail } from '../../context/UserContext';
import {  } from 'react-router';
import { useNavigate, useLocation } from 'react-router-dom';

const Verify = () => {
  const userDispatch = useUserDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      verifyEmail(token, navigate)(userDispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default Verify;
