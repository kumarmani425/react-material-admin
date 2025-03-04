import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

// Removed import of push from connected-react-router

const actions = {
  // Resets the form
  doNew: () => {
    return {
      type: 'USERS_FORM_RESET',
    };
  },

  // Finds a record by id; the caller should provide the navigate function
  doFind: (id, navigate) => async (dispatch) => {
    try {
      dispatch({ type: 'USERS_FORM_FIND_STARTED' });
      axios.get(`/users/${id}`).then((res) => {
        const record = res.data;
        dispatch({ type: 'USERS_FORM_FIND_SUCCESS', payload: record });
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({ type: 'USERS_FORM_FIND_ERROR' });
      // Use navigate instead of dispatching push
      if (navigate) {
        navigate('/admin/users');
      }
    }
  },

  // Creates a new record; navigate function is passed for redirection
  doCreate: (values, navigate) => async (dispatch) => {
    try {
      dispatch({ type: 'USERS_FORM_CREATE_STARTED' });
      axios.post('/users', { data: values }).then((res) => {
        dispatch({ type: 'USERS_FORM_CREATE_SUCCESS' });
        showSnackbar({ type: 'success', message: 'Users created' });
        if (navigate) {
          navigate('/app/users');
        }
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({ type: 'USERS_FORM_CREATE_ERROR' });
    }
  },

  // Updates existing data; accepts isProfile flag and navigate function
  doUpdate: (id, values, isProfile, navigate) => async (dispatch, getState) => {
    try {
      dispatch({ type: 'USERS_FORM_UPDATE_STARTED' });
      await axios.put(`/users/${id}`, { id, data: values });
      dispatch(doInit());
      dispatch({ type: 'USERS_FORM_UPDATE_SUCCESS' });
      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Users updated' });
        if (navigate) {
          navigate('/admin/users');
        }
      }
    } catch (error) {
      Errors.handle(error);
      dispatch({ type: 'USERS_FORM_UPDATE_ERROR' });
    }
  },
};

export default actions;