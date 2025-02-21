import type { Platform } from "./platformType"
import { ProfileWrapperMedium } from "./social-profiles.styles"
import CustomIcon from "../customIcon"

interface HorizontalLayoutProps {
    platforms: Platform[]
    activeStates: boolean[]
    handleIconClick: (id: number) => void
    connectedPlatforms: string[]
}

export function HorizontalLayout({
    platforms,
    activeStates,
    handleIconClick,
    connectedPlatforms,
}: HorizontalLayoutProps) {
    return (
        <ProfileWrapperMedium>
            {platforms.map(({ iconName, id, icon, activeIcon }) => (
                <div key={id} className="icon" style={{ cursor: "pointer" }} onClick={() => handleIconClick(id)}>
                    <CustomIcon
                        path={
                            activeStates[id] || platforms.find((x) => x.id === id)?.active || connectedPlatforms?.includes(iconName)
                                ? activeIcon
                                : icon
                        }
                    />
                </div>
            ))}
        </ProfileWrapperMedium>
    )
}

