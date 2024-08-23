// Non connected Social icons
import tiktokIcon from './../assets//images/tiktok-icon.png'
import instaIcon from './../assets/images/insta-icon.png'
import snapchatIcon from './../assets/images/snapchat-icon.png'
import robloxIcon from './../assets/images/roblox-icon.png'
import fortniteIcon from './../assets/images/fortnite-icon.png'
import decentralandIcon from './../assets//images/decentraland-icon.png'
import spatialIcon from './../assets/images/spatial-icon.png'
import metaIcon from './../assets/images/meta-icon.png'

// Connected Social icons
import tiktokIconColored from './../assets//images/tiktok-icon-colored.png'
import instaIconColored from './../assets/images/insta-icon-colored.png'
import snapchatIconColored from './../assets/images/snapchat-icon-colored.png'
import robloxIconColored from './../assets/images/roblox-icon-colored.png'
import fortniteIconColored from './../assets/images/fortnite-icon-colored.png'
import decentralandIconColored from './../assets//images/decentraland-icon-colored.png'
import spatialIconColored from './../assets/images/spatial-icon-colored.png'
import metaIconColored from './../assets/images/meta-icon-colored.png'
import artificialRomeIconColored from './../assets/images/artificial-rome-colored.png'

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

export const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

export const FACEBOOK_ROUTE = '/oauth-facebook'
export const INSTAGRAM_ROUTE = '/oauth-instagram'
export const SNAPCHAT_ROUTE = '/oauth-snapchat'
export const TIKTOK_ROUTE = '/oauth-tiktok'
export const ROBLOX_ROUTE = '/oauth-roblox'
export const FORTNITE_ROUTE = '/oauth-fortnite'
export const DECENTRALAND_ROUTE = '/oauth-decentraland'
export const SPATIAL_ROUTE = '/oauth-spatial'
export const ARTIFICIAL_ROME_ROUTE = '/oauth-artificialRome'

export const headerSteps = new Set([
    'success',
    'socialConnect',
    'metaverseHub',
    'socialConfirmation',
    'digitalWardrobe',
    'digitalWardrobeConnect',
    'dashboard',
    'profileSettings'

]);

export const backButtonSteps = new Set([
    'success',
    'socialConnect',
    'metaverseHub',
    'initial',
    'verification',
    'dashboard'
]);

export const SocialProfileUrls = {
    Meta: 'https://www.facebook.com/',
    Instagram: 'https://www.instagram.com/',
    SnapChat: 'https://www.snapchat.com/',
    Tiktok: 'https://www.tiktok.com/',
    Roblox: 'https://www.roblox.com/home',
    Fortnite: 'https://store.epicgames.com/en-US/',
    Decentraland: 'https://decentraland.org/',
    Spatial: 'https://www.spatial.io/',
    ArtificialRome: 'https://artificialrome.com/'
}

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

export const socialConnectButtons = [
    {
        id: 0,
        iconName: "tiktok",
        displayName: 'Tiktok',
        icon: tiktokIcon,
        active: false,
        activeIcon: tiktokIconColored
    },
    {
        id: 1,
        iconName: "insta",
        displayName: 'Instagram',
        icon: instaIcon,
        active: false,
        activeIcon: instaIconColored
    },
    {
        id: 2,
        iconName: "snapchat",
        displayName: 'SnapChat',
        icon: snapchatIcon,
        active: false,
        activeIcon: snapchatIconColored
    },
    {
        id: 3,
        iconName: "roblox",
        displayName: 'Roblox',
        icon: robloxIcon,
        active: false,
        activeIcon: robloxIconColored
    },
    {
        id: 4,
        iconName: "fortnite",
        displayName: 'Fortnite',
        icon: fortniteIcon,
        active: false,
        activeIcon: fortniteIconColored
    },
    {
        id: 5,
        iconName: "decentraland ",
        displayName: 'Decentraland',
        icon: decentralandIcon,
        active: false,
        activeIcon: decentralandIconColored
    },
    {
        id: 6,
        iconName: "spatial",
        displayName: 'Spatial',
        icon: spatialIcon,
        active: false,
        activeIcon: spatialIconColored
    },
    {
        id: 7,
        iconName: "meta",
        displayName: 'Meta',
        icon: metaIcon,
        active: false,
        activeIcon: metaIconColored
    }
]

export const metaverseHubButtons = [
    {
        id: 0,
        iconName: "tiktok",
        displayName: 'Tiktok',
        icon: tiktokIcon,
        active: false,
        activeIcon: tiktokIconColored,
    },
    {
        id: 1,
        iconName: "insta",
        displayName: 'Instagram',
        icon: instaIcon,
        active: false,
        activeIcon: instaIconColored,
    },
    {
        id: 2,
        iconName: "snapchat",
        displayName: 'SnapChat',
        icon: snapchatIcon,
        active: false,
        activeIcon: snapchatIconColored,
    },
    {
        id: 3,
        iconName: "roblox",
        displayName: 'Roblox',
        icon: robloxIcon,
        active: false,
        activeIcon: robloxIconColored,
    },
    {
        id: 4,
        iconName: "fortnite",
        displayName: 'Fortnite',
        icon: fortniteIcon,
        active: false,
        activeIcon: fortniteIconColored,
    },
    {
        id: 5,
        iconName: "decentraland ",
        displayName: 'Decentraland',
        icon: decentralandIcon,
        active: false,
        activeIcon: decentralandIconColored,
    },
    {
        id: 6,
        iconName: "spatial",
        displayName: 'Spatial',
        icon: spatialIcon,
        active: false,
        activeIcon: spatialIconColored,
    },
    {
        id: 7,
        iconName: "meta",
        displayName: 'Meta',
        icon: metaIcon,
        active: false,
        activeIcon: metaIconColored,
    },
    {
        id: 8,
        iconName: "artificialRome",
        displayName: 'ArtificialRome',
        icon: artificialRomeIconColored,
        active: true,
        activeIcon: artificialRomeIconColored,
    },
]







