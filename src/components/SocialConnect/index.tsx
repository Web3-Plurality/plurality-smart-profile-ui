import { useEffect, useState } from 'react';
import SocialProfiles from '../SocialProfiles';
import { connectOrbisDidPkh, insert, insertSmartProfile, select, selectSmartProfiles } from '../../common/orbis';
import { socialConnectButtons } from '../../common/constants';
import { litEncryptData, metamaskEncryptData } from '../../common/crypto';
import { useMetamaskPublicKey } from '../../hooks/useMetamaskPublicKey';
import { encryptData } from '../../common/utils';

interface SocialConnectProps {
    activeStates: boolean[],
    handleIconClick: (idx: number) => void
}

const SocialConnect = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    return (
        <SocialProfiles
            metaverse={false}
            handleIconClick={handleIconClick}
            activeStates={activeStates}
        />
    )
}

export default SocialConnect;
