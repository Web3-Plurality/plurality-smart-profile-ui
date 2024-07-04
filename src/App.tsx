import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';
import { StepProvider } from './context/StepContext';
import Header from './components/Header';
import { StytchProvider } from '@stytch/react';
import { StytchUIClient } from '@stytch/vanilla-js';

const stytch = new StytchUIClient(
  import.meta.env.VITE_APP_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
);


function App() {
  return (
    // it's just a dummy provider, will update it later as per our requiremnet
    <AuthProvider>
      <StepProvider>
        <StytchProvider stytch={stytch}>
          <Header />
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </StytchProvider>
      </StepProvider>
    </AuthProvider>

  );
}

export default App;
