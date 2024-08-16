import { MetaMaskAvatar } from 'react-metamask-avatar';

export const UserAvatar = ({ address, size }: { address: `0x${string}` | string, size: number }) => {
    return <MetaMaskAvatar address={address} size={size} />
}