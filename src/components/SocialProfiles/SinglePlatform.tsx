import type { Platform } from "./platformType"
import { ProfileWrapperSmall } from "./social-profiles.styles"
import CustomIcon from "../customIcon"

interface SinglePlatformProps {
    platforms: Platform[]
    activeStates: boolean[]
    handleIconClick: (id: number) => void
    connectedPlatforms: string[]
}

export function SinglePlatform({ platforms, activeStates, handleIconClick, connectedPlatforms }: SinglePlatformProps) {
    return (
        <ProfileWrapperSmall>
            {platforms.map(({ iconName, displayName, id, icon, activeIcon }) => {
                      const isActive = activeStates[id] || platforms.find((x) => x.id === id)?.active || connectedPlatforms?.includes(iconName)
                return (
                <div key={id} className="icon" style={{ cursor: "pointer" }} onClick={() => handleIconClick(id)}>
                    <div className="small-icon">
                        <CustomIcon
                            path={
                                isActive
                                    ? activeIcon
                                    : icon
                            }
                        />
                    </div>
                    <p>{isActive ? 'Connected' : 'Connect'} {displayName}</p>
                </div>
            )})}
        </ProfileWrapperSmall>
    )
}

