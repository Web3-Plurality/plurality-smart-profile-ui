import {
    AIDRESSING_ROUTE,
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
    TIKTOK_ROUTE,
    TWITTER_ROUTE
} from "./Constants"
// import HeaderLogo from './../assets/svgIcons/app-logo.png'

const setLocalStorageValue = (key: string, value: string) => localStorage.setItem(key, value)
const getLocalStorageValue = (key: string) => localStorage.getItem(key)

const showHeader = (currentStep: string) => {
    return headerSteps.has(currentStep);
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
    const platformName = localStorage.getItem('platformName')
    switch (currentStep) {
        case 'home':
            return 'Login To Your Account';
        case 'litLogin':
            return 'Enter Your Email';
        case 'register':
            return 'Register Your Account';
        case 'otp':
            return 'Register Your Account';
        case 'success':
            return `Welcome to ${platformName ? JSON.parse(platformName) : ''}`;
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
const getDescription = (currentStep: string) => {
    const platformDescription = localStorage.getItem('platformDescription')
    switch (currentStep) {
        case 'litLogin':
            return 'A verification code will be sent to your emaill'
        case 'otp':
            return 'Enter the 6 digit code sent to your email';
        case 'success':
            return platformDescription ? JSON.parse(platformDescription) : ''
        case 'digitalWardrobe':
            return 'Collection';
        case 'digitalWardrobeConnect':
            return 'Title of NFT';
        default:
            return '';
    }
};

const isLitLogin = (val: string) => {
    if (val.length) return true
    return false
}

const checkPreviousLoginMode = (account: string) => {
    const prevTool = localStorage.getItem('tool')

    if (prevTool && prevTool !== account) {
        const profileTypeStreamId = localStorage.getItem('profileTypeStreamId')
        const logo = localStorage.getItem('logo')
        const links = localStorage.getItem('links')
        const platforms = localStorage.getItem("platforms")
        const clientId = localStorage.getItem("clientId")
        const incentiveType = localStorage.getItem('incentives')
        const platformName = localStorage.getItem('platformName')
        const platformDescription = localStorage.getItem('platformDescription')

        localStorage.clear();

        localStorage.setItem('profileTypeStreamId', profileTypeStreamId || '')
        localStorage.setItem('logo', logo || '')
        localStorage.setItem('links', links || '')
        localStorage.setItem('platforms', platforms || '')
        localStorage.setItem('clientId', clientId || '')
        localStorage.setItem('incentives', incentiveType || '')
        localStorage.setItem('platformName', platformName || '')
        localStorage.setItem('platformDescription', platformDescription || '')
    }
}

const getBtntext = (currStep: string) => {
    if (currStep === 'socialConnect') return 'Continue'
    return 'Back'
}

const isBackBtnVisible = (currStep: string, loader: boolean) => {
    if (currStep === 'home' || currStep === 'success' || currStep === 'dashboard' || currStep === 'socialConnect' || loader) return false
    return true
}

const isRsmPlatform = () => {
    return window.location.pathname === '/rsm'
}

const isProfileConnectPlatform = () => {
    return window.location.pathname === '/profile-connect'
}

const getPlatformImage = () => {
    const platformLogo = localStorage.getItem('logo')
    return platformLogo ?? ''
}

export {
    setLocalStorageValue,
    getLocalStorageValue,
    RouteMapper,
    showHeader,
    showBackButton,
    getTitleText,
    getDescription,
    isLitLogin,
    checkPreviousLoginMode,
    getBtntext,
    isBackBtnVisible,
    isRsmPlatform,
    isProfileConnectPlatform,
    getPlatformImage
}