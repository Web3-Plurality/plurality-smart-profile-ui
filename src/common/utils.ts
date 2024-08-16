// Non connected Social icons
import tiktokIcon from './../assets//images/tiktok-icon.png'
import instaIcon from './../assets/images/insta-icon.png'
import snapchatIcon from './../assets/images/snapchat-icon.png'
import robloxIcon from './../assets/images/roblox-icon.png'
import fortniteIcon from './../assets/images/fortnite-icon.png'
// import SIcon from './../assets/images/s-icon.png'
import decentralandIcon from './../assets//images/decentraland-icon.png'
import spatialIcon from './../assets/images/spatial-icon.png'
import metaIcon from './../assets/images/meta-icon.png'
// import appleIcon from './../assets/images/apple-icon.png'
// import journeyIcon from './../assets/images/journey-icon.png'

// Connected Social icons
import tiktokIconColored from './../assets//images/tiktok-icon-colored.png'
import instaIconColored from './../assets/images/insta-icon-colored.png'
import snapchatIconColored from './../assets/images/snapchat-icon-colored.png'
import robloxIconColored from './../assets/images/roblox-icon-colored.png'
import fortniteIconColored from './../assets/images/fortnite-icon-colored.png'
// import SIconColored from './../assets/images/s-icon-colored.png'
import decentralandIconColored from './../assets//images/decentraland-icon-colored.png'
import spatialIconColored from './../assets/images/snapchat-icon-colored.png'
import metaIconColored from './../assets/images/meta-icon-colored.png'
// import appleIconColored from './../assets/images/apple-icon-colored.png'
// import journeyIconColored from './../assets/images/journey-icon-colored.png'

// Digital Wardrobe Images
import firstImage from './../assets/images/wardrobe/first.png'
import secondImage from './../assets/images/wardrobe/second.png'
import thirdImage from './../assets/images/wardrobe/third.png'
import fourthImage from './../assets/images/wardrobe/fourth.png'
import fifthImage from './../assets/images/wardrobe/fifth.png'
import sixthImage from './../assets/images/wardrobe/sixth.png'
import seventhImage from './../assets/images/wardrobe/seventh.png'
import eightImage from './../assets/images/wardrobe/eight.png'
import ninthImage from './../assets/images/wardrobe/ninth.png'

// Constant Routes
import {
    ARTIFICIAL_ROME_ROUTE,
    DECENTRALAND_ROUTE,
    FACEBOOK_ROUTE,
    FORTNITE_ROUTE,
    INSTAGRAM_ROUTE,
    ROBLOX_ROUTE,
    SNAPCHAT_ROUTE,
    SPATIAL_ROUTE,
    TIKTOK_ROUTE
} from './constants'


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
        case 'digitalWardrobe':
            return 'Digital Wardrobe';
        case 'digitalWardrobeConnect':
            return 'Digital Wardrobe';
        default:
            return '';
    }
};


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

export const socialConnectButtons = [
    { id: 0, iconName: "tiktok", displayName: 'Tiktok', icon: tiktokIcon, active: false, activeIcon: tiktokIconColored },
    { id: 1, iconName: "insta", displayName: 'Instagram', icon: instaIcon, active: false, activeIcon: instaIconColored },
    { id: 2, iconName: "snapchat", displayName: 'SnapChat', icon: snapchatIcon, active: false, activeIcon: snapchatIconColored },
    { id: 3, iconName: "roblox", displayName: 'Roblox', icon: robloxIcon, active: false, activeIcon: robloxIconColored },
    { id: 4, iconName: "fortnite", displayName: 'Fortnite', icon: fortniteIcon, active: false, activeIcon: fortniteIconColored },
    { id: 5, iconName: "decentraland ", displayName: 'Decentraland', icon: decentralandIcon, active: false, activeIcon: decentralandIconColored },
    { id: 6, iconName: "spatial", displayName: 'Spatial', icon: spatialIcon, active: false, activeIcon: spatialIconColored },
    { id: 7, iconName: "meta", displayName: 'Meta', icon: metaIcon, active: false, activeIcon: metaIconColored },
    // { id: 5, iconName: "sIcon", displayName: 'S', icon: SIcon, active: false, activeIcon: SIconColored },
    // { id: 9, iconName: "apple", displayName: 'Apple', icon: appleIcon, active: false, activeIcon: appleIconColored },
    // { id: 10, iconName: "midJourney", displayName: 'Journey', icon: journeyIcon, active: false, activeIcon: journeyIconColored },
]

export const digitalWardrobeImages = [
    firstImage,
    secondImage,
    thirdImage,
    fourthImage,
    fifthImage,
    sixthImage,
    seventhImage,
    eightImage,
    ninthImage
]


export const showHeader = (currentStep: string) => {
    const location = window.location.href
    const visibleSteps = [
        'success',
        'socialConnect',
        'socialConfirmation',
        'digitalWardrobe',
        'digitalWardrobeConnect',
        'dashboard'
    ];

    return visibleSteps.includes(currentStep) && location !== '/auth-start';
}

export const showBackButton = (currentStep: string) => {
    if (
        currentStep !== 'success'
        && currentStep !== 'socialConnect'
        && currentStep !== 'initial'
        && currentStep !== 'verification'
        && currentStep !== 'dashboard'
    ) return true
    return false
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

//export const queryParams = '?isWidget=true&origin=false&apps=false'