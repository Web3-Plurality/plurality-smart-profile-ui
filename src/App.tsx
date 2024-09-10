import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';
import { StepProvider } from './context/StepContext';
import Header from './components/Header';
import { StytchProvider } from '@stytch/react';
import { StytchUIClient } from '@stytch/vanilla-js';

import { WagmiProvider } from 'wagmi';
import { goerli, mainnet, optimism } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import { http, createConfig } from '@wagmi/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CallBackUrl from './pages/CallBackUrl';
import AuthStart from './pages/AuthStart';
import { message } from 'antd';

const stytch = new StytchUIClient(
  import.meta.env.VITE_APP_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
);


const client = createConfig({
  chains: [goerli, mainnet, optimism],
  connectors: [
    metaMask({
      preferDesktop: true,
      modals: {
        install: ({ terminate }) => {
          message.error("MetaMask is not available for this device, please continue with email")
          return {
            unmount: terminate,
          };
        },
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [goerli.id]: http(),
    [optimism.id]: http(),
  },
});


const queryClient = new QueryClient()

function App() {
  return (
    <AuthProvider>
      <StepProvider>
        <WagmiProvider config={client}>
          <QueryClientProvider client={queryClient}>
            <StytchProvider stytch={stytch}>
              <Router>
                <Header />
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/auth-callback" element={<CallBackUrl />} />
                  <Route path="/auth-start" element={<AuthStart />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </StytchProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </StepProvider>
    </AuthProvider>

  );
}

export default App;
