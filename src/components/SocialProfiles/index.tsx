import type { SocialProfilesProps } from "./platformType"
import { usePlatformState } from "./../../hooks/usePlatformState"
import { getLocalStorageValueofClient, getPlatformImage } from "../../utils/Helpers"
import { CircularLayout } from "./CircularLayout"
import { HorizontalLayout } from "./HorizontalLayout"
import { SinglePlatform } from "./SinglePlatform"
import { CLIENT_ID } from "../../utils/EnvConfig"

const SocialProfiles = ({ activeStates, handleIconClick }: SocialProfilesProps) => {
    const queryParams = new URLSearchParams(location.search)
    const clientId = queryParams.get("client_id") || CLIENT_ID
    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)

    usePlatformState(profileTypeStreamId, activeStates)

    const { platforms: socialIcons, smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
    const connectedPlatforms = smartProfileData?.data?.smartProfile?.connectedPlatforms || []
    const platformImage = getPlatformImage()
    const platformCount = socialIcons?.length || 0

    if (platformCount > 4) {
        return (
            <CircularLayout
                platforms={socialIcons}
                activeStates={activeStates}
                handleIconClick={handleIconClick}
                connectedPlatforms={connectedPlatforms}
                platformImage={platformImage}
            />
        )
    }

    if (platformCount > 1) {
        return (
            <HorizontalLayout
                platforms={socialIcons}
                activeStates={activeStates}
                handleIconClick={handleIconClick}
                connectedPlatforms={connectedPlatforms}
            />
        )
    }

    return (
        <SinglePlatform
            platforms={socialIcons}
            activeStates={activeStates}
            handleIconClick={handleIconClick}
            connectedPlatforms={connectedPlatforms}
        />
    )
}

export default SocialProfiles