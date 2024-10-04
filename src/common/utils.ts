// Constant Routes
import {
    ARTIFICIAL_ROME_ROUTE,
    backButtonSteps,
    DECENTRALAND_ROUTE,
    AIDRESSING_ROUTE,
    FACEBOOK_ROUTE,
    FORTNITE_ROUTE,
    headerSteps,
    INSTAGRAM_ROUTE,
    ROBLOX_ROUTE,
    SNAPCHAT_ROUTE,
    SPATIAL_ROUTE,
    TIKTOK_ROUTE
} from './constants'
import { litDecryptData, litEncryptData, metamaskDecryptData, metamaskEncryptData } from './crypto';
import HeaderLogo from './../assets/svgIcons/app-logo.png';

// Component Title Mapper
export const getTitleText = (prevSteps: string[]) => {
    const currentStep = prevSteps[prevSteps.length - 1];
    const previousStep = prevSteps[prevSteps.length - 2];
    const platformName = localStorage.getItem('platformName')

    switch (currentStep) {
        case 'initial':
            return 'Login To Your Account';
        case 'login':
            if (previousStep === 'register') {
                return 'Register Your Account';
            } else {
                return 'Enter Your Email';
            }
        case 'register':
            return 'Register Your Account';
        case 'otp':
            return 'Register Your Account';
        case 'success':
            return `Welcome to ${JSON.parse(platformName || '')}`;
        case 'socialConnect':
            return 'Connect Your Platforms';
        case 'metaverseHub':
            return 'Your Metaverse Hub';
        case 'digitalWardrobe':
            return 'Digital Wardrobe';
        case 'digitalWardrobeConnect':
            return 'Digital Wardrobe';
        default:
            return '';
    }
};

// Component Description Mapper
export const getDescription = (prevSteps: string[]) => {
    const currentStep = prevSteps[prevSteps.length - 1];
    const previousStep = prevSteps[prevSteps.length - 2];
    const platformDescription = localStorage.getItem('platformDescription')
    switch (currentStep) {
        case 'login':
            if (previousStep === 'register') {
                return 'A verification code will be sent to your emaill';
            } else {
                return '';
            }
        case 'otp':
            return 'Enter the 6 digit code sent to your email';
        case 'success':
            return JSON.parse(platformDescription || '');
        case 'digitalWardrobe':
            return 'Collection';
        case 'digitalWardrobeConnect':
            return 'Title of NFT';
        default:
            return '';
    }
};

export const showHeader = (currentStep: string) => {
    return headerSteps.has(currentStep);
}

export const showBackButton = (currentStep: string) => {
    return !backButtonSteps.has(currentStep);
}

export const RouteMapper = (app: string) => {
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
        default:
            return FACEBOOK_ROUTE
    }
}

export const encryptData = async (dataToEncrypt: string, publicKey: string | undefined) => {
    const sessionSigs = localStorage.getItem("signature")
    if (sessionSigs) {
        const result = await litEncryptData(dataToEncrypt)
        return result
    } else {
        if (publicKey) {
            const result = metamaskEncryptData(publicKey, dataToEncrypt)
            return result
        }
    }
}

export const decryptData = async (encryptedData: string) => {
    let decryptionResult;
    const sessionSigs = localStorage.getItem("signature")
    if (sessionSigs) {
        if (encryptedData) {
            const result = await litDecryptData(JSON.parse(sessionSigs), JSON.parse(encryptedData).ciphertext, JSON.parse(encryptedData).dataToEncryptHash);
            if (result && typeof result === 'object') {
                decryptionResult = JSON.parse(result.decryptedMessage);
            } else {
                throw new Error("Invalid result fom Lit decryption");
            }
        }
    } else {
        const result = await metamaskDecryptData(encryptedData)
        if (result.code && result.code === -32603) {
            return result
        }
        console.log("Resulst", result)
        decryptionResult = JSON.parse(result)

    }
    return decryptionResult
}

export const getPlatformImage = () => {
    const platformLogo = localStorage.getItem('logo')
    return platformLogo ? platformLogo : HeaderLogo
}

export const isRsmPlatform = () => {
    return window.location.pathname === '/rsm'
}

export const isProfileConnectPlatform = () => {
    return window.location.pathname === '/profile-connect'
}