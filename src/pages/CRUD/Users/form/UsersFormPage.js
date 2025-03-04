import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; // Use hooks for router info
import UsersForm from 'pages/CRUD/Users/form/UsersForm';
import actions from 'actions/users/usersFormActions';
import { connect } from 'react-redux';

const UsersFormPage = (props) => {
  const { dispatch, saveLoading, findLoading, record, currentUser } = props;
  const [dispatched, setDispatched] = useState(false);

  // Get parameters and location from router
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if editing based on existence of params.id
  const isEditing = () => !!params.id;

  // Determine if current page is the profile page
  const isProfile = () => location.pathname === '/app/profile';

  // onSubmit handler calls doUpdate or doCreate action creators,
  // passing "navigate" for redirection
  const doSubmit = (id, data) => {
    if (isEditing() || isProfile()) {
      dispatch(actions.doUpdate(id, data, isProfile(), navigate));
    } else {
      dispatch(actions.doCreate(data, navigate));
    }
  };

  useEffect(() => {
    if (isEditing()) {
      dispatch(actions.doFind(params.id, navigate));
    } else {
      if (isProfile()) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const currentUserId = currentUser.user.id;
        dispatch(actions.doFind(currentUserId, navigate));
      } else {
        dispatch(actions.doNew());
      }
    }
    setDispatched(true);
    // Include dependencies to update when router parameters change
  }, [params, location.pathname, dispatch, navigate]);

  return (
    <>
      {dispatched && (
        <UsersForm
          saveLoading={saveLoading}
          findLoading={findLoading}
          currentUser={currentUser}
          record={isEditing() || isProfile() ? record : {}}
          isEditing={isEditing()}
          isProfile={isProfile()}
          onSubmit={doSubmit}
          onCancel={() => navigate('/app/users')}
        />
      )}
    </>
  );
};

function mapStateToProps(store) {
  return {
    findLoading: store.users.form.findLoading,
    saveLoading: store.users.form.saveLoading,
    record: store.users.form.record,
    currentUser: store.auth.currentUser,
  };
}

export default connect(mapStateToProps)(UsersFormPage);