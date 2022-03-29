import React, { useContext } from 'react';

import { Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { useKeycloak } from '@react-keycloak/web';
import AuthService from '../services/AuthService';
import AuthContext from '../contexts/AuthContext';

const LogoutRedirect: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (authContext.loggedIn) {
    AuthService.logout().then(
      () => authContext.setLoggedIn(false),
      () => authContext.setLoggedIn(false)
    );
  } else {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <Typography variant="body1" color="textSecondary" component="p">
        You are being logged out!
      </Typography>
      <Typography variant="body1" color="textSecondary" component="p">
        You will be redirected to the the home page.
      </Typography>
    </div>
  );
};

export const KeycloakLogoutRedirect: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();
  const authContext = useContext(AuthContext);

  if (authContext.loggedIn && initialized) {
    keycloak.logout();
  } else {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <Typography variant="body1" color="textSecondary" component="p">
        You are being logged out!
      </Typography>
      <Typography variant="body1" color="textSecondary" component="p">
        You will be redirected to the home page.
      </Typography>
    </div>
  );
};

export default LogoutRedirect;
