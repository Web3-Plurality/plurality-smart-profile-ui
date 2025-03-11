import { AuthUserInformation } from "@useorbis/db-sdk";
import {
    AIDRESSING_ROUTE,
    ARTIFICIAL_ROME_ROUTE,
    backButtonSteps,
    DECENTRALAND_ROUTE,
    FACEBOOK_ROUTE,
    FORTNITE_ROUTE,
    headerSteps,
    INSTAGRAM_ROUTE,
    interestsPillsColors,
    overRideConsentComponents,
    ROBLOX_ROUTE,
    SNAPCHAT_ROUTE,
    SPATIAL_ROUTE,
    TIKTOK_ROUTE,
    TWITTER_ROUTE
} from "./Constants"
import { CLIENT_ID } from "./EnvConfig";
import { connectOrbisDidPkh } from "../services/orbis/getOrbisDidPkh";
import { message } from "antd";
import { sendProfileConnectedEvent, sendUserConsentEvent, sendUserDataEvent } from "./sendEventToParent";

const setLocalStorageValue = (key: string, value: string) => localStorage.setItem(key, value)
const getLocalStorageValue = (key: string) => localStorage.getItem(key)

const showHeader = (currentStep: string | undefined) => {
    return headerSteps.has(currentStep!);
}

const showBackButton = (currentStep: string) => {
    return !backButtonSteps.has(currentStep);
}

const RouteMapper = (app: string) => {
    switch (app) {
        case 'instagram':
            return INSTAGRAM_ROUTE
        case 'snapchat':
            return SNAPCHAT_ROUTE
        case 'roblox':
            return ROBLOX_ROUTE
        case 'fortnite':
            return FORTNITE_ROUTE
        case 'tiktok':
            return TIKTOK_ROUTE
        case 'decentraland':
            return DECENTRALAND_ROUTE
        case 'ai-dressing':
            return AIDRESSING_ROUTE
        case 'spatial':
            return SPATIAL_ROUTE
        case 'artificialRome':
            return ARTIFICIAL_ROME_ROUTE
        case 'twitter':
            return TWITTER_ROUTE
        default:
            return FACEBOOK_ROUTE
    }
}

// Component Title Mapper
const getTitleText = (currentStep: string) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { platformName } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    const isIframe = window.self !== window.top;
    switch (currentStep) {
        case 'home':
            return '';
        case 'litLogin':
            return 'Enter Your Email';
        case 'register':
            return 'Login into Your Account';
        case 'otp':
            return 'Login into Your Account';
        case 'success':
            return `Welcome to ${platformName || ''} Profile`;
        case 'socialConnect':
            return 'Connect Your Platforms';
        case 'digitalWardrobeConnect':
            return 'Digital Wardrobe';
        case 'metaverseHub':
            return 'Your Metaverse Hub';
        case 'digitalWardrobe':
            return 'Digital Wardrobe';
        case 'profileSettings':
            return `${isIframe ? 'Update Profile' : ''}`;
        case 'consent':
            return 'Confirm your choices';
        case 'transaction':
            return 'Confirm your action';
        case 'signing':
            return 'Your sign is requested';
        case 'contract':
            return 'Contract Details';
        case 'profileSetup':
                return "Let's Setup Your Profile!";
        default:
            return '';
    }
};

// Component Description Mapper
const getDescription = (currentStep: string) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { platformDescription } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    switch (currentStep) {
        case 'litLogin':
            return 'A verification code will be sent to your email'
        case 'otp':
            return 'Enter the 6 digit code sent to your email';
        case 'success':
            return platformDescription || '';
        case 'digitalWardrobe':
            return 'Collection';
        case 'digitalWardrobeConnect':
            return 'Title of NFT';
        default:
            return '';
    }
};

const getParentUrl = () => {
    const { ancestorOrigins, origin } = window.location
    const parentUrl = ancestorOrigins.length > 0 ? ancestorOrigins[0] : origin
    return parentUrl
}


const getParentHost = () => {
    const { ancestorOrigins, origin } = window.location
    const parentUrl = ancestorOrigins.length > 0 ? ancestorOrigins[0] : origin
    const parentHost = new URL(parentUrl).hostname;
    return parentHost
}

const isLitLogin = (val: string) => {
    if (val.length) return true
    return false
}

const checkPreviousLoginMode = (account: string) => {
    const queryParams = new URLSearchParams(location.search);
    const allKeys = Object.keys(localStorage);

    const keysToKeep = allKeys.filter(key => key.startsWith('clientID') || key.startsWith('streamID'));

    const keysAndValues: Record<string, string> = {};

    keysToKeep.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            keysAndValues[key] = value;
        }
    });
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { tool: prevTool } = getLocalStorageValueofClient(`clientID-${clientId}`)

    if (prevTool && prevTool !== account) {
        localStorage.clear();

        Object.keys(keysAndValues).forEach(key => {
            localStorage.setItem(key, keysAndValues[key]);
        });
    }
}

const getBtntext = (currStep: string) => {
    if (currStep === 'socialConnect') return 'Continue'
    return 'Back'
}

const isBackBtnVisible = (currStep: string, loader: boolean) => {
    const isIframe = window.self !== window.top && currStep !== 'litLogin' && currStep !== 'otp'
    if (isIframe || currStep === 'home' || currStep === 'success' || currStep === 'dashboard' || currStep === 'socialConnect' || currStep === 'profile' || loader) return false
    return true
}

const getLocalStorageValueofClient = (storageID: string) => {
    const storageData = getLocalStorageValue(storageID)

    return storageData ? JSON.parse(storageData) : {}
}
const getPlatformImage = () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { logo: platformLogo } = getLocalStorageValueofClient(`clientID-${clientId}`)

    return platformLogo ?? ''
}

const handleLocalStorageOnLogout = (currentClientId: string) => {
    const allKeys = Object.keys(localStorage);
    const keysToKeep = allKeys.filter(key => key.startsWith('clientID') || key.startsWith('streamID'));

    const keysAndValues: Record<string, string> = {};

    const { clientId, incentives, links, logo, profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${currentClientId}`)

    const updatedData = {
        clientId,
        incentives,
        links,
        logo,
        profileTypeStreamId
    };

    setLocalStorageValue(`clientID-${currentClientId}`, JSON.stringify(updatedData));

    keysToKeep.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            keysAndValues[key] = value;
        }
    })

    localStorage.clear();

    Object.keys(keysAndValues).forEach(key => {
        setLocalStorageValue(key, keysAndValues[key]);
    });
}

const addGlobalLitData = (currentClientId: string) => {
    const { litWalletSig, litSessionKey } = getLocalStorageValueofClient(`clientID-${currentClientId}`)
    setLocalStorageValue('lit-wallet-sig', litWalletSig)
    setLocalStorageValue('lit-session-key', litSessionKey)
}

const removeGlobalLitData = () => {
    localStorage.removeItem('lit-wallet-sig')
    localStorage.removeItem('lit-session-key')
}

const redirectUserOnLogout = (currentClientId: string, appClientId: string | null) => {
    let path = '/'
    if (appClientId) {
        path = `${location.pathname}?client_id=${currentClientId}`
    }

    return path
}

const reGenerateUserDidAddress = async () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const userDidAddress: AuthUserInformation | "" | "error" | undefined = await connectOrbisDidPkh();
    if (userDidAddress === "error") {
        message.error('Something went Wrong!')
    } else if (userDidAddress && userDidAddress.did) {
        const existingDataString = localStorage.getItem(`clientID-${clientId}`)
        let existingData = existingDataString ? JSON.parse(existingDataString) : {}

        existingData = {
            ...existingData,
            userDid: userDidAddress?.did
        }
        localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))
    }
}

const serializeSmartProfile = (smartProfile: any) => {
    smartProfile.scores = JSON.stringify(smartProfile.scores);
    smartProfile.connectedPlatforms = JSON.stringify(smartProfile.connectedPlatforms);
    smartProfile.extendedPublicData = JSON.stringify(smartProfile.extendedPublicData);
    smartProfile.attestation = JSON.stringify(smartProfile.attestation);
    if (smartProfile.privateData !== '') {
        smartProfile.privateData = JSON.stringify(smartProfile.privateData);
    }
}

const deserializeSmartProfile = (smartProfile: any, unecryptedPrivateDataObj?: any) => {
    smartProfile.scores = JSON.parse(smartProfile.scores);
    smartProfile.connectedPlatforms = JSON.parse(smartProfile.connectedPlatforms);
    smartProfile.extendedPublicData = JSON.parse(smartProfile.extendedPublicData);
    smartProfile.attestation = JSON.parse(smartProfile.attestation);
    if (unecryptedPrivateDataObj) {
        smartProfile.privateData = unecryptedPrivateDataObj;
    } else {
        smartProfile.privateData = JSON.parse(smartProfile.privateData);
    }
}

const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-3)}`;
};

const getRandomColor = (index: number): string => {
    const colorIndex = index % interestsPillsColors.length;
    return interestsPillsColors[colorIndex];
};

const handleUserConsentFlow = (
    consent: string,
    step: string,
    prevStep: string,
    cb: (step: string) => void
) => {
    const ignoreConsent = overRideConsentComponents.includes(prevStep)

    if ((consent == 'accepted' || consent == 'rejected') && !ignoreConsent) {
        sendUserConsentEvent()
        sendProfileConnectedEvent()
    } else {
        cb(step)
    }
    sendUserDataEvent()
};

const isInIframe = (): boolean => {
    return window !== window.parent
}

const platformCount = () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)

    const { platforms } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
    return platforms?.length
}

export {
    setLocalStorageValue,
    getLocalStorageValue,
    RouteMapper,
    showHeader,
    showBackButton,
    getTitleText,
    getDescription,
    getParentUrl,
    getParentHost,
    isLitLogin,
    checkPreviousLoginMode,
    getBtntext,
    isBackBtnVisible,
    getPlatformImage,
    getLocalStorageValueofClient,
    handleLocalStorageOnLogout,
    addGlobalLitData,
    removeGlobalLitData,
    redirectUserOnLogout,
    reGenerateUserDidAddress,
    serializeSmartProfile,
    deserializeSmartProfile,
    truncateAddress,
    getRandomColor,
    handleUserConsentFlow,
    isInIframe,
    platformCount
}