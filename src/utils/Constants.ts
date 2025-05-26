// Non connected Social icons
import tiktokIcon from './../assets//images/tiktok-icon.png'
import instaIcon from './../assets/images/insta-icon.png'
import snapchatIcon from './../assets/images/snapchat-icon.png'
import robloxIcon from './../assets/images/roblox-icon.png'
import fortniteIcon from './../assets/images/fortnite-icon.png'
import decentralandIcon from './../assets//images/decentraland-icon.png'
import spatialIcon from './../assets/images/spatial-icon.png'
import metaIcon from './../assets/images/meta-icon.png'
import twitterIcon from './../assets/images/twitter-icon.png'

// Connected Social icons
import tiktokIconColored from './../assets//images/tiktok-icon-colored.png'
import instaIconColored from './../assets/images/insta-icon-colored.png'
import snapchatIconColored from './../assets/images/snapchat-icon-colored.png'
import robloxIconColored from './../assets/images/roblox-icon-colored.png'
import fortniteIconColored from './../assets/images/fortnite-icon-colored.png'
import aidressingIconColored from './../assets/images/ai-colored.png'
import decentralandIconColored from './../assets//images/decentraland-icon-colored.png'
import spatialIconColored from './../assets/images/spatial-icon-colored.png'
import metaIconColored from './../assets/images/meta-icon-colored.png'
import artificialRomeIconColored from './../assets/images/artificial-rome-colored.png'
import twitterIconColored from './../assets/images/twitter-icon-colored.png'
import vicIconColored from './../assets/images/VIC.png'

// Error messages
export const ErrorMessages = {
    DEVICE_NOT_SUPPORTED: 'MetaMask is not available for this device, please continue with email',
    GENERAL_ERROR: 'Something went wrong!',
    SSID_MISSING_ERROR: 'sse_id query parameter is missing',
    ACCESS_TOKEN_ID_ERROR: 'No access token ID found in search parameters.',
    EVENT_REGISTRATION_FAILED: 'Error during event registration',
    METAMASK_NOT_CONNECTED: 'Please connect to MetaMask',
    STYCH_EMAIL_LOGIN_ERROR: 'Something goes wrong while sending the passcode, please try it again',
    ORBIS_CONNECTION_FAILED: 'Error connecting to Orbis',
    SAFARI_ERROR: 'This app is not available on safari, please use any other browser'
}

// Loader messages
export const LoaderMessages = {
    STYCH_OTP_SEND: 'Sending OTP to your Email...',
    STYCH_OTP_VERFICATION: 'Verifying OTP...',
    LIT_PROFILE_SETUP: 'Setting up your profiles...',
    LIT_AUTH_CREDENTIALS: 'Authenticating your credentials...',
    LIT_LOOK_UP_ACCOUNTS: 'Looking up your accounts...',
    LIT_SECURE_SESSION: 'Securing your session...',
}

// OAuth Routes
export const FACEBOOK_ROUTE = '/oauth-facebook'
export const INSTAGRAM_ROUTE = '/oauth-instagram'
export const SNAPCHAT_ROUTE = '/oauth-snapchat'
export const TIKTOK_ROUTE = '/oauth-tiktok'
export const TWITTER_ROUTE = '/oauth-twitter'
export const ROBLOX_ROUTE = '/oauth-roblox'
export const FORTNITE_ROUTE = '/oauth-fortnite'
export const DECENTRALAND_ROUTE = '/oauth-decentraland'
export const AIDRESSING_ROUTE = '/oauth-aidressing'
export const SPATIAL_ROUTE = '/oauth-spatial'
export const ARTIFICIAL_ROME_ROUTE = '/oauth-artificialRome'

// Digital Wardrobe images
import firstImage from './../assets/images/wardrobe/first.png'
import secondImage from './../assets/images/wardrobe/second.png'
import thirdImage from './../assets/images/wardrobe/third.png'
import fourthImage from './../assets/images/wardrobe/fourth.png'
import fifthImage from './../assets/images/wardrobe/fifth.png'
import sixthImage from './../assets/images/wardrobe/sixth.png'
import seventhImage from './../assets/images/wardrobe/seventh.png'
import eightImage from './../assets/images/wardrobe/eight.png'
import ninthImage from './../assets/images/wardrobe/ninth.png'

// import PolygonIcon from './../assets/svgIcons/polygon.svg';
import EthereumIcon from './../assets/svgIcons/ethereum-logo.svg';

export const digitalWardrobeImages = [
    firstImage, secondImage, thirdImage,
    fourthImage, fifthImage, sixthImage,
    seventhImage, eightImage, ninthImage
]

// Social Connect Profiles
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
        active: false,
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
    {
        id: 5,
        iconName: "spatial",
        displayName: 'Spatial',
        icon: spatialIcon,
        active: true,
        activeIcon: spatialIconColored
    },
    {
        id: 6,
        iconName: "artificialRome",
        displayName: 'ArtificialRome',
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
    {
        id: 8,
        iconName: "decentraland ",
        displayName: 'Decentraland',
        icon: decentralandIcon,
        active: false,
        activeIcon: decentralandIconColored
    },
    {
        id: 9,
        iconName: "meta",
        displayName: 'Meta',
        icon: metaIcon,
        active: false,
        activeIcon: metaIconColored
    },
    {
        id: 10,
        iconName: "twitter",
        displayName: 'Twitter',
        icon: twitterIcon,
        active: false,
        activeIcon: twitterIconColored
    },
    {
        id: 11,
        iconName: "VIC",
        displayName: 'VIC',
        icon: vicIconColored,
        active: true,
        activeIcon: vicIconColored
    }
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
        active: false,
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

// Steps where header is visible
export const headerSteps = new Set([
    'socialConnect',
    'metaverseHub',
    'socialConfirmation',
    'digitalWardrobe',
    'digitalWardrobeConnect',
    'profileSettings'
]);

// Steps where back button is visible
export const backButtonSteps = new Set([
    'success',
    'socialConnect',
    'metaverseHub',
    'home',
    'verification',
    'dashboard'
]);

export const SocialProfileUrls = {
    Instagram: 'https://www.instagram.com/ar/1246108036298968',
    Snapchat: 'https://www.roblox.com/games/12563183319/Outfit-Shopping-Mall-DRESSX-MANGO',
    TikTok: 'https://www.fortnite.com/@gcg_games/3511-4821-9572',
    Roblox: 'https://www.roblox.com/games/12563183319/Outfit-Shopping-Mall-DRESSX-MANGO',
    Fortnite: 'https://www.fortnite.com/@gcg_games/3511-4821-9572',
    DRESSX: 'https://dressx.me/',
    Decentraland: 'https://decentraland.org/',
    Spatial: 'https://www.spatial.io/s/BOSS-Immersive-Showroom-641e08bd6127ed8eaff70faa?share=3302646144092575883',
    "Artificial Rome": 'https://artificialrome.com/case/legacy-of-tomorrow'
}

export const domain = window.location.host;
export const origin = window.location.origin;
export const statement = "I am the owner of this address";

export const WalletTabsKeys = [
    {
        key: 1,
        name: 'balance',
        label: 'Balance'

    },
    {
        key: 2,
        name: 'send',
        label: 'Send'

    },
    {
        key: 3,
        name: 'receive',
        label: 'Receive'

    },
]

export const SupportedNetwork = [
    {
        chainId: '11155111',
        token: 'ETH',
        chainName: 'Sepolia',
        rpc: 'https://eth-sepolia.public.blastapi.io',
        icon: EthereumIcon,
        priceUSD: 'endpoint'
    },
    // {
    //     chainId: '1',
    //     token: 'ETH',
    //     chainName: 'Ethereum',
    //     rpc: '',
    //     icon: PolygonIcon
    // },
    // {
    //     chainId: '137',
    //     token: 'Matic',
    //     chainName: 'Polygon',
    //     rpc: '',
    //     icon: PolygonIcon
    // }
]


export const interestsPillsColors = [
    // Original colors
    '#f50',
    '#2db7f5',
    '#87d068',
    '#108ee9',
    '#722ed1',  // Purple
    '#13c2c2',  // Cyan
    '#eb2f96',  // Pink
    '#faad14',  // Gold
    '#52c41a',  // Green
    '#1890ff',  // Blue
    '#fa8c16',  // Orange
    '#a0d911',  // Lime
    '#eb2f96',  // Magenta
    '#fadb14',  // Yellow
    '#7cb305',  // Olive
    '#096dd9',  // Ocean Blue
    '#08979c',  // Teal
    '#531dab',  // Deep Purple
    '#cf1322',  // Red
    '#237804',  // Forest Green
];

export const overRideConsentComponents = [
    'profile',
    'profileSettings',
    'wallet',
    'consent',
    'contract',
    'signing',
    'profileSetup',
    'onboardingForm'
]

export const hideBackButtonforSteps = ['socialConnect', 'profile', 'profileSetup', 'onboardingForm']
export const hideBackButtonforStepsInIframe = ['socialConnect', 'profileSettings', 'profile', 'consent', 'profileSetup', 'onboardingForm']