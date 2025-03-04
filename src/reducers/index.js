import auth from 'reducers/auth';
import { combineReducers } from 'redux';
import users from 'reducers/users/usersReducers';

// Removed connectRouter as we're not using connected-react-router anymore
export default combineReducers({
  auth,
  // users,
});