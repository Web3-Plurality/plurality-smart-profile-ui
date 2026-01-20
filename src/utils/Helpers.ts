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
  TWITTER_ROUTE,
} from "./Constants";
import { CLIENT_ID } from "./EnvConfig";
import {
  sendProfileConnectedEvent,
  sendUserConsentEvent,
  sendUserDataEvent,
} from "./sendEventToParent";
import { ProfilePrivateData } from "@plurality-network/smart-profile-utils";

const setLocalStorageValue = (key: string, value: string) =>
  localStorage.setItem(key, value);
const getLocalStorageValue = (key: string) => localStorage.getItem(key);

const showHeader = (currentStep: string | undefined) => {
  return headerSteps.has(currentStep!);
};

const showBackButton = (currentStep: string) => {
  return !backButtonSteps.has(currentStep);
};

const RouteMapper = (app: string) => {
  switch (app) {
    case "instagram":
      return INSTAGRAM_ROUTE;
    case "snapchat":
      return SNAPCHAT_ROUTE;
    case "roblox":
      return ROBLOX_ROUTE;
    case "fortnite":
      return FORTNITE_ROUTE;
    case "tiktok":
      return TIKTOK_ROUTE;
    case "decentraland":
      return DECENTRALAND_ROUTE;
    case "ai-dressing":
      return AIDRESSING_ROUTE;
    case "spatial":
      return SPATIAL_ROUTE;
    case "artificialRome":
      return ARTIFICIAL_ROME_ROUTE;
    case "twitter":
      return TWITTER_ROUTE;
    default:
      return FACEBOOK_ROUTE;
  }
};

// Component Title Mapper
const getTitleText = (currentStep: string) => {
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("client_id") || CLIENT_ID;

  const { profileTypeStreamId } = getLocalStorageValueofClient(
    `clientID-${clientId}`
  );
  const { platformName } = getLocalStorageValueofClient(
    `streamID-${profileTypeStreamId}`
  );

  const isIframe = window.self !== window.top;
  switch (currentStep) {
    case "home":
      return "";
    case "success":
      return `Welcome to ${platformName || ""} Profile`;
    case "socialConnect":
      return "Connect Your Platforms";
    case "digitalWardrobeConnect":
      return "Digital Wardrobe";
    case "metaverseHub":
      return "Your Metaverse Hub";
    case "digitalWardrobe":
      return "Digital Wardrobe";
    case "profileSettings":
      return `${isIframe ? "Update Profile" : ""}`;
    case "consent":
      return "Confirm your choices";
    case "signing":
      return "Your sign is requested";
    case "profileSetup":
      return "Let's Setup Your Profile!";
    default:
      return "";
  }
};

// Component Description Mapper
const getDescription = (currentStep: string) => {
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("client_id") || CLIENT_ID;

  const { profileTypeStreamId } = getLocalStorageValueofClient(
    `clientID-${clientId}`
  );
  const { platformDescription } = getLocalStorageValueofClient(
    `streamID-${profileTypeStreamId}`
  );

  switch (currentStep) {
    case "success":
      return platformDescription || "";
    case "digitalWardrobe":
      return "Collection";
    case "digitalWardrobeConnect":
      return "Title of NFT";
    default:
      return "";
  }
};

const getParentUrl = () => {
  const { ancestorOrigins, origin } = window.location;
  const parentUrl = ancestorOrigins.length > 0 ? ancestorOrigins[0] : origin;
  return parentUrl;
};

const getParentHost = () => {
  const { ancestorOrigins, origin } = window.location;
  const parentUrl = ancestorOrigins.length > 0 ? ancestorOrigins[0] : origin;
  const parentHost = new URL(parentUrl).hostname;
  return parentHost;
};

const checkPreviousLoginMode = (account: string) => {
  const queryParams = new URLSearchParams(location.search);
  const allKeys = Object.keys(localStorage);

  const keysToKeep = allKeys.filter(
    (key) => key.startsWith("clientID") || key.startsWith("streamID")
  );

  const keysAndValues: Record<string, string> = {};

  keysToKeep.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      keysAndValues[key] = value;
    }
  });
  const clientId = queryParams.get("client_id") || CLIENT_ID;
  const { tool: prevTool } = getLocalStorageValueofClient(
    `clientID-${clientId}`
  );

  if (prevTool && prevTool !== account) {
    localStorage.clear();

    Object.keys(keysAndValues).forEach((key) => {
      localStorage.setItem(key, keysAndValues[key]);
    });
  }
};

const getBtntext = (currStep: string) => {
  if (currStep === "socialConnect") return "Continue";
  return "Back";
};

const isBackBtnVisible = (currStep: string, loader: boolean) => {
  const isIframe = window.self !== window.top;

  // Steps that should never show back button
  const alwaysHideBackButton = ["home", "success", "dashboard", "socialConnect", "profileSetup", "onboardingForm"];

  // Steps that hide back button only in iframe context
  const hideInIframeOnly = ["profile"];

  if (
    isIframe ||
    alwaysHideBackButton.includes(currStep) ||
    (isIframe && hideInIframeOnly.includes(currStep)) ||
    loader
  )
    return false;
  return true;
};

const getLocalStorageValueofClient = (storageID: string) => {
  const storageData = getLocalStorageValue(storageID);

  return storageData ? JSON.parse(storageData) : {};
};
const getPlatformImage = () => {
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("client_id") || CLIENT_ID;

  const { logo: platformLogo } = getLocalStorageValueofClient(
    `clientID-${clientId}`
  );

  return platformLogo ?? "";
};

const handleLocalStorageOnLogout = (currentClientId: string) => {
  const allKeys = Object.keys(localStorage);
  const keysToKeep = allKeys.filter(
    (key) => key.startsWith("clientID") || key.startsWith("streamID")
  );

  const keysAndValues: Record<string, string> = {};

  const {
    clientId,
    incentives,
    links,
    logo,
    onboardingQuestions,
    customOnboarding,
    authentication,
    showRoulette,
    profileTypeStreamId,
  } = getLocalStorageValueofClient(`clientID-${currentClientId}`);

  const updatedData = {
    clientId,
    incentives,
    links,
    logo,
    showRoulette,
    onboardingQuestions,
    customOnboarding,
    authentication,
    profileTypeStreamId,
  };

  setLocalStorageValue(
    `clientID-${currentClientId}`,
    JSON.stringify(updatedData)
  );

  keysToKeep.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      keysAndValues[key] = value;
    }
  });

  localStorage.clear();

  Object.keys(keysAndValues).forEach((key) => {
    setLocalStorageValue(key, keysAndValues[key]);
  });
};

const redirectUserOnLogout = (
  currentClientId: string,
  appClientId: string | null
) => {
  let path = "/";
  if (appClientId) {
    path = `${path}?client_id=${currentClientId}`;
  }

  return path;
};


const serializeSmartProfile = (smartProfile: any) => {
  smartProfile.scores = JSON.stringify(smartProfile.scores);
  smartProfile.connectedPlatforms = JSON.stringify(
    smartProfile.connectedPlatforms
  );
  smartProfile.extendedPublicData = JSON.stringify(
    smartProfile.extendedPublicData
  );
  smartProfile.attestation = JSON.stringify(smartProfile.attestation);
  if (smartProfile.privateData !== "") {
    smartProfile.privateData = JSON.stringify(smartProfile.privateData);
  }
};

const tryParseJSON = (value: any, fallback: any = {}) => {
  // If it's already an object (not a string), return it as-is
  if (typeof value === 'object' && value !== null) {
    return value;
  }
  // If it's a string, try to parse it
  try {
      return value ? JSON.parse(value) : fallback;
  } catch (e) {
      console.warn("Failed to parse JSON:", value, e);
      return fallback;
  }
};

const safeParseLocalStorage = (key: string, fallback = {}) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null") {
      return fallback;
    }
    return tryParseJSON(item, fallback);
  } catch (e) {
    console.error(`Failed to parse localStorage key "${key}":`, e);
    return fallback;
  }
};

const deserializeSmartProfile = (
  smartProfile: any,
  unecryptedPrivateDataObj?: any
) => {
  smartProfile.scores = tryParseJSON(smartProfile.scores, {});

  // connectedPlatforms should be an array
  const parsedConnectedPlatforms = tryParseJSON(smartProfile.connectedPlatforms, []);
  smartProfile.connectedPlatforms = Array.isArray(parsedConnectedPlatforms) ? parsedConnectedPlatforms : [];

  smartProfile.extendedPublicData = tryParseJSON(smartProfile.extendedPublicData, {});
  smartProfile.attestation = tryParseJSON(smartProfile.attestation, {});

  if (unecryptedPrivateDataObj) {
    smartProfile.privateData = unecryptedPrivateDataObj;
  } else {
    // Initialize with proper ProfilePrivateData structure instead of empty object
    // This ensures the structure is always valid for encryption
    const parsedPrivateData = tryParseJSON(smartProfile.privateData, null);
    smartProfile.privateData = parsedPrivateData || new ProfilePrivateData();
  }
};

const truncateAddress = (address: string) => {
  if (!address) return "";
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
  prevStep2: string,
  cb: (step: string) => void,
  showRoulette: boolean,
  handleNavigation: () => void,
  handleShouldProfilesRender: () => void

) => {
  const ignoreConsent = overRideConsentComponents.includes(prevStep);
  const stepDetails = step == 'socialConnect' && prevStep2 == 'success'
  const isIframe = isInIframe();
  const firstCondition = (consent == "accepted" || consent == "rejected") && !ignoreConsent && stepDetails;

  if (firstCondition) {
    sendUserConsentEvent();
    sendProfileConnectedEvent();
  } else {
    if(showRoulette){
      cb(step);
      handleShouldProfilesRender();
    }else if(!showRoulette && isIframe) {
      // Only show consent page if consent hasn't been given yet
      if (consent === 'accepted' || consent === 'rejected') {
        // Consent already given, send events and allow closing
        sendUserConsentEvent();
        sendProfileConnectedEvent();
      } else {
        // No consent yet, show consent page
        cb('consent');
      }
    }else{
      handleNavigation()
    }
  }
  sendUserDataEvent();
};

const isInIframe = (): boolean => {
  return window !== window.parent;
};

const platformCount = () => {
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("client_id") || CLIENT_ID;
  const { profileTypeStreamId } = getLocalStorageValueofClient(
    `clientID-${clientId}`
  );

  const { platforms } = getLocalStorageValueofClient(
    `streamID-${profileTypeStreamId}`
  );
  return platforms?.length;
};

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
  checkPreviousLoginMode,
  getBtntext,
  isBackBtnVisible,
  getPlatformImage,
  getLocalStorageValueofClient,
  handleLocalStorageOnLogout,
  redirectUserOnLogout,
  serializeSmartProfile,
  deserializeSmartProfile,
  truncateAddress,
  getRandomColor,
  handleUserConsentFlow,
  isInIframe,
  platformCount,
  tryParseJSON,
  safeParseLocalStorage,
};
