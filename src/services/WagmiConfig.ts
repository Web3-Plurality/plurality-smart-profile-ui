import { goerli, mainnet, optimism } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import { http, createConfig } from '@wagmi/core'
import { QueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { ErrorMessages } from '../utils/Constants';


export const client = createConfig({
    chains: [goerli, mainnet, optimism],
    connectors: [
        metaMask({
            preferDesktop: true,
            modals: {
                install: ({ terminate }) => {
                    message.error(ErrorMessages.DEVICE_NOT_SUPPORTED)
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


export const queryClient = new QueryClient()