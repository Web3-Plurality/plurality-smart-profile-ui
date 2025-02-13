import { useEffect, useRef, useState } from "react"
import type { Platform } from "./platformType"
import { ProfileIconsWrapper } from "./social-profiles.styles"
import useResponsive from "../../hooks/useResponsive"
import CircleImg from "./../../assets/images/circle.png"
import CustomIcon from "../customIcon"

interface CircularLayoutProps {
    platforms: Platform[]
    activeStates: boolean[]
    handleIconClick: (id: number) => void
    connectedPlatforms: string[]
    platformImage: string
    platformCount: number
}

export function CircularLayout({
    platforms,
    activeStates,
    handleIconClick,
    connectedPlatforms,
    platformImage,
    platformCount,
}: CircularLayoutProps) {
    const circleRef = useRef<HTMLDivElement>(null)
    const [circleRadius, setCircleRadius] = useState(153)
    const { isExtraSmallScreen, isMobileScreen, isTabScreen } = useResponsive()
    const isIframe = window.self !== window.top

    useEffect(() => {
        if (circleRef.current) {
            const width = circleRef.current.offsetWidth
            const baseRadius = isExtraSmallScreen
                ? width / 1.98
                : isMobileScreen
                    ? isIframe
                        ? width / 2.06
                        : width / 2.1
                    : width / 2.07
            setCircleRadius(baseRadius - 30)
        }
    }, [circleRef.current?.offsetWidth, isMobileScreen, isTabScreen, isIframe, isExtraSmallScreen])

    const angle = (360 / platforms.length) * (Math.PI / 180)
    const rotationAdjustment = -20 * (Math.PI / 180)

    return (
        <ProfileIconsWrapper ref={circleRef} imageUrl={CircleImg} className="circle">
            <div className="mid-icon">
                <img className="app-logo-center" src={platformImage || "/placeholder.svg"} alt="" />
            </div>
            {platforms.map(({ iconName, id, icon, activeIcon }, index) => {
                const currentAngle = platformCount === 5
                         ? angle * index + rotationAdjustment
                         : angle * index
                const x = circleRadius * Math.cos(currentAngle)
                const y = circleRadius * Math.sin(currentAngle)
                const iconSize = isExtraSmallScreen
                    ? "22px"
                    : isMobileScreen
                        ? isIframe
                            ? "26px"
                            : "22px"
                        : isTabScreen
                            ? "29px"
                            : "27px"

                return (
                    <div
                        key={id}
                        className="icon"
                        style={{
                            position: "absolute",
                            left: `calc(50% + ${x}px - ${iconSize})`,
                            top: `calc(50% + ${y}px - ${iconSize})`,
                            cursor: "pointer",
                        }}
                        onClick={() => handleIconClick(id)}
                    >
                        <CustomIcon
                            path={
                                activeStates[id] || platforms.find((x) => x.id === id)?.active || connectedPlatforms?.includes(iconName)
                                    ? activeIcon
                                    : icon
                            }
                        />
                    </div>
                )
            })}
        </ProfileIconsWrapper>
    )
}

