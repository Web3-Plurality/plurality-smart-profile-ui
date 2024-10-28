import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { persistor, store } from './services/store'
import { Provider } from 'react-redux'
import { StytchProvider } from '@stytch/react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';

import useResponsive from './hooks/useResponsive';
import Login from './pages/Login'
import CallBackUrl from './pages/CallBackUrl'
import AuthStart from './pages/AuthStart'
import PageNotFound from './pages/PageNotFound'
import { stytch } from './services/Stytch';
import { client, queryClient } from './services/WagmiConfig'

import './globalStyles.css'
import Header from './components/Header';
import { message } from 'antd';
import { useEffect } from 'react';
import { ErrorMessages } from './utils/Constants';
import Unauthorized from './pages/UnAuthorizedDomain';
import EventListener from './components/EventListener';



function App() {
  const { isMobileScreen, isTabScreen } = useResponsive()

  useEffect(() => {
    const isSafari = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return /safari/.test(userAgent) && !/chrome/.test(userAgent);
    };

    // safari on mobile
    if (isMobileScreen && isSafari()) {
      message.warning(ErrorMessages.SAFARI_ERROR)
    }
  }, [isMobileScreen]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WagmiProvider config={client}>
          <QueryClientProvider client={queryClient}>
            <StytchProvider stytch={stytch}>
              <Router>
                {!isTabScreen && !isMobileScreen && <Header />}
                <EventListener />
                <Routes>
                  <Route path="/rsm" element={<Login />} />
                  <Route path="/" element={<Login />} />
                  <Route path="/profile-connect" element={<Login />} />
                  <Route path="/auth-callback" element={<CallBackUrl />} />
                  <Route path="/auth-start" element={<AuthStart />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Router>
            </StytchProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
