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
            {platforms.map(({ iconName, displayName, id, icon, activeIcon }) => (
                <div key={id} className="icon" style={{ cursor: "pointer" }} onClick={() => handleIconClick(id)}>
                    <div className="small-icon">
                        <CustomIcon
                            path={
                                activeStates[id] || platforms.find((x) => x.id === id)?.active || connectedPlatforms?.includes(iconName)
                                    ? activeIcon
                                    : icon
                            }
                        />
                    </div>
                    <p>Connect {displayName}</p>
                </div>
            ))}
        </ProfileWrapperSmall>
    )
}

