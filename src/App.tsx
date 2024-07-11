import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';
import { StepProvider } from './context/StepContext';
import Header from './components/Header';
import { StytchProvider } from '@stytch/react';
import { StytchUIClient } from '@stytch/vanilla-js';
import { goerli, mainnet, optimism } from 'wagmi/chains';
import { safe } from 'wagmi/connectors'

import { http, createConfig } from '@wagmi/core'
import { coinbaseWallet, metaMask } from 'wagmi/connectors';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MetaMaskProvider } from './context/MetamaskContext';

const stytch = new StytchUIClient(
  import.meta.env.VITE_APP_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
);

const client = createConfig({
  chains: [goerli, mainnet, optimism],
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'wagmi',
    }),
    safe({
      shimDisconnect: true,
    })
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
    // it's just a dummy provider, will update it later as per our requiremnet
    <AuthProvider>
      <StepProvider>
        <MetaMaskProvider>
          <WagmiProvider config={client}>
            <QueryClientProvider client={queryClient}>
              <StytchProvider stytch={stytch}>
                <Header />
                <Router>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="*" element={<NotFound />} />

                  </Routes>
                </Router>
              </StytchProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </MetaMaskProvider>
      </StepProvider>
    </AuthProvider>

  );
}

export default App;
