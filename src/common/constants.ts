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
    'dashboard'
]);

export const backButtonSteps = new Set([
    'success',
    'socialConnect',
    'initial',
    'verification',
    'dashboard'
]);




