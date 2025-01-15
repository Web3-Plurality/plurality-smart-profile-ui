import { generatePkpWalletInstance } from "../services/orbis/generatePkpWallet";
import { DAppData } from "../types";
import { CLIENT_ID } from "./EnvConfig";
import { getLocalStorageValueofClient } from "./Helpers";

const queryParams = new URLSearchParams(location.search);
const clientId = queryParams.get('client_id') || CLIENT_ID;

const getParentUrl = () => {
    const { ancestorOrigins, origin } = window.location
    const parentUrl = ancestorOrigins.length > 0 ? ancestorOrigins[0] : origin
    return parentUrl
}

export const sendUserConsentEvent = () => {
    window.parent.postMessage({ eventName: 'consentData', data: { consent: true } }, getParentUrl());
}

export const sendProfileConnectedEvent = () => {
    const { litWalletSig } = getLocalStorageValueofClient(`clientID-${clientId}`)
    window.parent.postMessage({ eventName: 'litConnection', data: { isConnected: !!litWalletSig } }, getParentUrl());
}

export const sendUserDataEvent = (id: string = '',
    resetSPId: () => void = () => { }) => {
    const { consent } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const {
        smartProfileData: parssedUserOrbisData,
    } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)


    const { username,
        avatar,
        bio,
        interests,
        reputationTags,
        collections,
        badges,
        scores,
        connectedPlatforms,
    } = parssedUserOrbisData?.data?.smartProfile || {}

    const userData: DAppData = {
        name: username,
        avatar,
        rating: connectedPlatforms?.length,
        bio,
        consent: false,
    }

    if (consent) {
        const { accepted } = consent

        if (accepted) {
            userData.interests = interests
            userData.reputationTags = reputationTags
            userData.badges = badges
            userData.collections = collections
            userData.scores = scores
            userData.consent = true
        }
    }

    if (id) {
        window.parent.postMessage({ id, eventName: 'getSmartProfile', data: userData }, getParentUrl());
        resetSPId?.()
    } else {
        window.parent.postMessage({ id, eventName: 'userData', data: userData }, getParentUrl());
    }
}


export const sendMessageSignedEvent = async (
    message: string,
    id: number | null,
    onComplete?: () => void
) => {
    try {
        const pkpWallet = await generatePkpWalletInstance()
        const signature = await pkpWallet!.signMessage(message);
        window.parent.postMessage({ id, eventName: 'getMessageSignature', data: signature }, getParentUrl());
    }
    catch (error) {
        console.error(error);
        window.parent.postMessage({ id, eventName: 'errorMessage', data: (error as Error).toString() }, getParentUrl());
    }
    finally {
        onComplete?.();
    }
}
