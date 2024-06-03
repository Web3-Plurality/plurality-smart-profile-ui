import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';
import { StepProvider } from './context/StepContext';

function App() {
  return (
    // it's just a dummy provider, will update it later as per our requiremnet
    <AuthProvider>
      <StepProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </StepProvider>
    </AuthProvider>

  );
}

export default App;
