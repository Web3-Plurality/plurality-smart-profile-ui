import { useEffect, useRef, useState } from 'react';
import { ProfileData } from '../types';
import { getPlatformImage } from '../utils/Helpers';
import CustomIcon from './customIcon';
import styled from 'styled-components';
import useResponsive from '../hooks/useResponsive';

type Platform = {
    active: boolean,
    activeIcon: string,
    displayName: string,
    icon: string,
    iconName: string,
    id: number
}


const ProfileIconsWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 375px;
    height: 375px;
    border-radius: 50%;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    background: url("/src/assets/images/circle.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: auto;

    .mid-icon {
        position: absolute;
        width: 50px;
        height: 50px;
    }

    .icon {
        position: absolute;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        transition: transform 0.3s ease-in-out;
    }

    @media (max-width: 575.98px) {
        .circle {
            width: 310px;
            height: 310px;
        }

        .icon {
            width: 45px;
            height: 45px;
        }
    }
`

type MetaverseProps = {
    metaverse?: boolean,
    handleIconClick: (id: number) => void,
    activeStates: boolean[]
}

const SocialProfiles = ({
    activeStates,
    handleIconClick,
}: MetaverseProps) => {
    const circleRef = useRef<HTMLDivElement>(null);
    const [circleRadius, setCircleRadius] = useState(153);

    const { isMobileScreen, isTabScreen } = useResponsive()

    useEffect(() => {
        if (circleRef.current) {
            const width = circleRef.current.offsetWidth;
            const radSize = isMobileScreen ? 2 : 2.1
            setCircleRadius(width / radSize - 30);
        }
    }, [circleRef.current?.offsetWidth, isMobileScreen]);

    // const numIcons = socialConnectButtons.length;
    const socailIcons = localStorage.getItem("platforms");
    const parsedSocailIcons = socailIcons ? JSON.parse(socailIcons) : [];

    // Calculate the angle between each icon
    const angle = (360 / parsedSocailIcons.length) * (Math.PI / 180);

    const updateLocalStoragePlatforms = (activeStates: boolean[]) => {
        const platforms = localStorage.getItem("platforms");
        const parsedPlatforms = platforms ? JSON.parse(platforms) : [];

        const updatedPlatforms = parsedPlatforms.map((platform: Platform) => ({
            ...platform,
            active: platform.active ? true : activeStates[platform.id] || false
        }));

        localStorage.setItem("platforms", JSON.stringify(updatedPlatforms));
    };

    useEffect(() => {
        updateLocalStoragePlatforms(activeStates);
    }, [activeStates]);

    const smartProfileData = localStorage.getItem('smartProfileData');
    const connectedPlatforms = smartProfileData ? JSON.parse(smartProfileData).data.smartProfile.connected_platforms : [];

    const plaformImg = getPlatformImage()

    return (
        <ProfileIconsWrapper ref={circleRef} className="circle">
            <div className='mid-icon'>
                <img className="app-logo-center" src={plaformImg} alt='' />
            </div>
            {parsedSocailIcons && parsedSocailIcons.map(({ iconName, id, icon, activeIcon }: { iconName: string, id: number, icon: string, activeIcon: string }, index: number) => {
                const x = circleRadius * Math.cos(angle * index);
                const y = circleRadius * Math.sin(angle * index);
                return (
                    <div
                        key={id}
                        className={`icon `}
                        style={{
                            position: "absolute",
                            left: `calc(50% + ${x}px - ${isMobileScreen ? '23px' : isTabScreen ? '29px' : '27px'})`,
                            top: `calc(50% + ${y}px - ${isMobileScreen ? '20px' : isTabScreen ? '25px' : '25px'})`,
                            cursor: 'pointer'
                        }}
                        onClick={() => handleIconClick(id)}
                    >
                        <CustomIcon
                            path={
                                activeStates[id] ||
                                    parsedSocailIcons.find((x: ProfileData) => x.id === id)?.active ||
                                    connectedPlatforms?.includes(iconName)
                                    ? activeIcon : icon} />
                    </div>
                );
            })}
        </ProfileIconsWrapper>
    );
}

export default SocialProfiles;
