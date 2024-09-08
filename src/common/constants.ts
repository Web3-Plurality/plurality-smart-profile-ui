// Non connected Social icons
import tiktokIcon from './../assets//images/tiktok-icon.png'
import instaIcon from './../assets/images/insta-icon.png'
import snapchatIcon from './../assets/images/snapchat-icon.png'
import robloxIcon from './../assets/images/roblox-icon.png'
import fortniteIcon from './../assets/images/fortnite-icon.png'
// import decentralandIcon from './../assets//images/decentraland-icon.png'
import spatialIcon from './../assets/images/spatial-icon.png'
// import metaIcon from './../assets/images/meta-icon.png'

// Connected Social icons
import tiktokIconColored from './../assets//images/tiktok-icon-colored.png'
import instaIconColored from './../assets/images/insta-icon-colored.png'
import snapchatIconColored from './../assets/images/snapchat-icon-colored.png'
import robloxIconColored from './../assets/images/roblox-icon-colored.png'
import fortniteIconColored from './../assets/images/fortnite-icon-colored.png'
import aidressingIconColored from './../assets/images/ai-colored.png'
// import decentralandIconColored from './../assets//images/decentraland-icon-colored.png'
import spatialIconColored from './../assets/images/spatial-icon-colored.png'
// import metaIconColored from './../assets/images/meta-icon-colored.png'
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
export const AIDRESSING_ROUTE = '/oauth-aidressing'
export const SPATIAL_ROUTE = '/oauth-spatial'
export const ARTIFICIAL_ROME_ROUTE = '/oauth-artificialRome'

export const headerSteps = new Set([
    'socialConnect',
    'metaverseHub',
    'socialConfirmation',
    'digitalWardrobe',
    'digitalWardrobeConnect',
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
    Instagram: 'https://www.instagram.com/ar/1246108036298968',
    SnapChat: 'https://www.roblox.com/games/12563183319/Outfit-Shopping-Mall-DRESSX-MANGO',
    Tiktok: 'https://www.fortnite.com/@gcg_games/3511-4821-9572',
    Roblox: 'https://www.roblox.com/games/12563183319/Outfit-Shopping-Mall-DRESSX-MANGO',
    Fortnite: 'https://www.fortnite.com/@gcg_games/3511-4821-9572',
    AIDressing: 'https://dressx.me/',
    Decentraland: 'https://decentraland.org/',
    Spatial: 'https://www.spatial.io/s/BOSS-Immersive-Showroom-641e08bd6127ed8eaff70faa?share=3302646144092575883',
    ArtificialRome: 'https://artificialrome.com/case/legacy-of-tomorrow'
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
        displayName: 'TikTok',
        icon: tiktokIcon,
        active: false,
        activeIcon: tiktokIconColored
    },
    {
        id: 1,
        iconName: "insta",
        displayName: 'Instagram',
        icon: instaIcon,
        active: true,
        activeIcon: instaIconColored
    },
    {
        id: 2,
        iconName: "snapchat",
        displayName: 'Snapchat',
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
    // {
    //     id: 5,
    //     iconName: "decentraland ",
    //     displayName: 'Decentraland',
    //     icon: decentralandIcon,
    //     active: false,
    //     activeIcon: decentralandIconColored
    // },
    {
        id: 5,
        iconName: "spatial",
        displayName: 'Spatial',
        icon: spatialIcon,
        active: true,
        activeIcon: spatialIconColored
    },
    // {
    //     id: 7,
    //     iconName: "meta",
    //     displayName: 'Meta',
    //     icon: metaIcon,
    //     active: false,
    //     activeIcon: metaIconColored
    // },
    {
        id: 6,
        iconName: "artificialRome",
        displayName: 'Artificial Rome',
        icon: artificialRomeIconColored,
        active: true,
        activeIcon: artificialRomeIconColored,
    },
    {
        id: 7,
        iconName: "aiDressing ",
        displayName: 'DRESSX',
        icon: aidressingIconColored,
        active: true,
        activeIcon: aidressingIconColored,
    },
]

export const metaverseHubButtons = [
    {
        id: 0,
        iconName: "tiktok",
        displayName: 'TikTok',
        icon: tiktokIcon,
        active: false,
        activeIcon: tiktokIconColored,
    },
    {
        id: 1,
        iconName: "insta",
        displayName: 'Instagram',
        icon: instaIcon,
        active: true,
        activeIcon: instaIconColored,
    },
    {
        id: 2,
        iconName: "snapchat",
        displayName: 'Snapchat',
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
        iconName: "spatial",
        displayName: 'Spatial',
        icon: spatialIcon,
        active: true,
        activeIcon: spatialIconColored,
    },
    {
        id: 6,
        iconName: "artificialRome",
        displayName: 'Artificial Rome',
        icon: artificialRomeIconColored,
        active: true,
        activeIcon: artificialRomeIconColored,
    },
    {
        id: 7,
        iconName: "aiDressing ",
        displayName: 'DRESSX',
        icon: aidressingIconColored,
        active: true,
        activeIcon: aidressingIconColored,
    },
]

export const CEREMAIC_URL = import.meta.env.VITE_APP_CERAMIC_URL
export const ORBIS_NODE_URL = import.meta.env.VITE_APP_ORBIS_NODE_URL
export const ORBIS_ENV = import.meta.env.VITE_APP_ORBIS_ENV
export const PLURALITY_CONTEXT = import.meta.env.VITE_APP_PLURALITY_CONTEXT
export const INDIVIDUAL_PROFILE_MODEL = import.meta.env.VITE_APP_INDIVIDUAL_PROFILE_MODEL
export const SMART_PROFILE_MODEL = import.meta.env.VITE_APP_SMART_PROFILE_MODEL
export const PROFILE_TYPE_MODEL = import.meta.env.VITE_PROFILE_TYPE_MODEL
export const PROFILE_TYPE_STREAM_ID = import.meta.env.VITE_APP_PROFILE_TYPE_STREAM_ID
