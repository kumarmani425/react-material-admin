import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './reducers/store';   // Our new store created with Redux Toolkit

import { ThemeProvider as ThemeProviderV5 } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import { LayoutProvider } from './context/LayoutContext';
import { UserProvider } from './context/UserContext';
import { ManagementProvider } from './context/ManagementContext';
import { ThemeProvider as ThemeChangeProvider, ThemeStateContext } from './context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <LayoutProvider>
      <UserProvider>
        <StyledEngineProvider injectFirst>
          <ThemeChangeProvider>
            <ThemeStateContext.Consumer>
              {(theme) => (
                <ThemeProviderV5 theme={theme}>
                  <ManagementProvider>
                    <CssBaseline />
                    <App />
                  </ManagementProvider>
                </ThemeProviderV5>
              )}
            </ThemeStateContext.Consumer>
          </ThemeChangeProvider>
        </StyledEngineProvider>
      </UserProvider>
    </LayoutProvider>
  </Provider>
);

serviceWorker.unregister();