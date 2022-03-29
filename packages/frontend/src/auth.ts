import Keycloak from 'keycloak-js';

export const keycloakClient = Keycloak({
  url: process.env.REACT_APP_AUTH_SERVER_URL,
  realm: process.env.REACT_APP_AUTH_SERVER_REALM!,
  clientId: process.env.REACT_APP_AUTH_SERVER_CLIENT_ID!,
});

export default keycloakClient;
