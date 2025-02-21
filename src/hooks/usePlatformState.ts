import { useEffect } from "react"
import type { Platform } from "./../components/SocialProfiles/platformType"
import { getLocalStorageValueofClient } from "../utils/Helpers"

export function usePlatformState(profileTypeStreamId: string, activeStates: boolean[]) {
    useEffect(() => {
        const updateLocalStoragePlatforms = () => {
            const { platforms } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

            const updatedPlatforms = platforms?.map((platform: Platform) => ({
                ...platform,
                active: platform.active ? true : activeStates[platform.id] || false,
            }))

            const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
            let existingData = existingDataString ? JSON.parse(existingDataString) : {}

            existingData = {
                ...existingData,
                platforms: updatedPlatforms,
            }
            localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
        }

        updateLocalStoragePlatforms()
    }, [activeStates, profileTypeStreamId])
}

