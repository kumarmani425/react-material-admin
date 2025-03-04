import React from 'react';
import { Router, Route, Routes, Navigate } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from './Snackbar';

// components
import Layout from './Layout';
import Documentation from './Documentation/Documentation';

// pages
import Error from '../pages/error';
import Login from '../pages/login';
import Verify from '../pages/verify';
import Reset from '../pages/reset';

// context
import { useUserState } from '../context/UserContext';
import { getHistory } from '../index';

export default function App() {
  // global
  let { isAuthenticated } = useUserState();
  const isAuth = isAuthenticated();

  return (
    <>
      <SnackbarProvider>
        <ConnectedRouter history={getHistory()}>
          <Router history={getHistory()}>
            <Routes>
              <Route
                exact
                path='/'
                render={() => <Navigate to='/app/profile' />}
              />

              <Route
                exact
                path='/app'
                render={() => <Navigate to='/app/dashboard' />}
              />

              <Route path='/documentation' component={Documentation} />
              <PrivateRoute path='/app' component={Layout} />
              <PublicRoute path='/login' component={Login} />
              <PublicRoute path='/verify-email' exact component={Verify} />
              <PublicRoute path='/password-reset' exact component={Reset} />
              <Navigate from='*' to='/app/dashboard' />
              <Route component={Error} />
            </Routes>
          </Router>
        </ConnectedRouter>
      </SnackbarProvider>
    </>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuth ? (
            React.createElement(component, props)
          ) : (
            <Navigate to={'/login'} />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuth ? (
            <Navigate
              to={{
                pathname: '/',
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
