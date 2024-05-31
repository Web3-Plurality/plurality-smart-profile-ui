import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    // it's just a dummy provider, will update it later as per our requiremnet
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>

  );
}

export default App;
