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

export const sendProfileConnectedEvent = (id?: string) => {
    const { litWalletSig, token } = getLocalStorageValueofClient(`clientID-${clientId}`)
    let event;
    if (id) {
        event = {
            id,
            eventName: 'getLoginInfo',
            data: {
                status: !!litWalletSig,
                pluralityToken: token
            }
        }
    } else {
        event = {
            eventName: 'litConnection',
            data: {
                isConnected: !!litWalletSig,
                token
            }
        }
    }

    window.parent.postMessage(event, getParentUrl());
}

export const sendUserDataEvent = (
    id: string = '',
    event: string = '',
    resetSPId: () => void = () => { }
) => {
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

    if (id && event === 'update') {
        window.parent.postMessage({ id, eventName: 'updateConsentData', data: userData }, getParentUrl());
        resetSPId?.()
    } else if (id && event === 'get') {
        window.parent.postMessage({ id, eventName: 'getSmartProfile', data: userData }, getParentUrl());
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

export const sendExtentedPublicData = async (
    id: number,
) => {
    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    const extendedPublicData = smartProfileData?.data?.smartProfile?.extendedPublicData?.[`${clientId}`]

    window.parent.postMessage({ id, eventName: 'getAppData', data: extendedPublicData || 'No Data Found' }, getParentUrl());
}

