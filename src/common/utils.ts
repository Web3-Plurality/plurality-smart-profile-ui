// Constant Routes
import {
    ARTIFICIAL_ROME_ROUTE,
    backButtonSteps,
    DECENTRALAND_ROUTE,
    FACEBOOK_ROUTE,
    FORTNITE_ROUTE,
    headerSteps,
    INSTAGRAM_ROUTE,
    ROBLOX_ROUTE,
    SNAPCHAT_ROUTE,
    SPATIAL_ROUTE,
    TIKTOK_ROUTE
} from './constants'

// Component Title Mapper
export const getTitleText = (prevSteps: string[]) => {
    const currentStep = prevSteps[prevSteps.length - 1];
    const previousStep = prevSteps[prevSteps.length - 2];

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
            return 'Welcome to Your Metaverse Profile!';
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
            return 'Earn points by connecting your social profiles and metaverse platforms.';
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
        case 'spatial':
            return SPATIAL_ROUTE
        case 'artificialRome':
            return ARTIFICIAL_ROME_ROUTE
        default:
            return FACEBOOK_ROUTE
    }
}