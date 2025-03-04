import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth';        // Make sure authReducer is compatible (can use createSlice if needed)
import usersReducer from './users/usersReducers'; // Similarly, update usersReducer if needed

// Combine reducers using Redux Toolkit (the same as Redux combineReducers)
const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  // you can add more reducers here
});

// Create store using configureStore from Redux Toolkit
const store = configureStore({
  reducer: rootReducer,
  // Redux Toolkit automatically adds redux-thunk and Redux DevTools support
  // You can also add additional middleware by uncommenting and editing the following:
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(anotherMiddleware),
});

export default store;