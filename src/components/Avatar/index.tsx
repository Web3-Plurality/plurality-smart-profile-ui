import { MetaMaskAvatar } from 'react-metamask-avatar';

export const UserAvatar = ({ address }: { address: `0x${string}` | undefined }) => {
    if (!address) {
        return null
    }
    <MetaMaskAvatar address={address} size={46} />
}