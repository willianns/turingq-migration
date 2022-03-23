import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';
import { AuthStore } from './contexts/AuthContext';

const App: React.FC = () => (
  <BrowserRouter>
    <AuthStore>
      <Navbar />
      <AppRouter />
    </AuthStore>
  </BrowserRouter>
);

export default App;
