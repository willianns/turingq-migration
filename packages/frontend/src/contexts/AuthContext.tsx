/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import AuthService from '../services/AuthService';

const Context = React.createContext({
  loggedIn: false,
  setLoggedIn: (loggedIn: boolean) => {},
});

interface AuthStoreProps {
  children: React.ReactNode;
}

export const AuthStore: React.FC<AuthStoreProps> = ({
  children,
}: AuthStoreProps) => {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn && AuthService.getAuthToken()) {
    setLoggedIn(true);
  }

  return (
    <Context.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
