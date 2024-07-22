import { MetaMaskAvatar } from 'react-metamask-avatar';

export const UserAvatar = ({ address }: { address: `0x${string}` | string }) => {
    return <MetaMaskAvatar address={address} size={46} />
}