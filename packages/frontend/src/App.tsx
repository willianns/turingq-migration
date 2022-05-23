import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ReactKeycloakProvider } from '@react-keycloak/web';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';
import keycloakClient from './auth';

const App: React.FC = () => 
 (
    <ReactKeycloakProvider authClient={keycloakClient}>
      <BrowserRouter>
        <Navbar />
        <AppRouter />
      </BrowserRouter>
    </ReactKeycloakProvider>
  );

export default App;
