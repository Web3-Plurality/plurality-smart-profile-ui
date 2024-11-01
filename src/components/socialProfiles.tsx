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
    width: 80vw;
    height: 80vw;
    max-width: 375px;
    max-height: 375px;
    border-radius: 50%;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    background: url("/src/assets/images/circle.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: auto;

    .mid-icon {
        position: absolute;
        width: 10vw;
        height: 10vw;
        max-width: 50px;
        max-height: 50px;
    }

    .icon {
        position: absolute;
        width: 12vw;
        height: 12vw;
        max-width: 55px;
        max-height: 55px;
        border-radius: 50%;
        transition: transform 0.3s ease-in-out;

        @media (max-width: 365px) {
            max-width: 45px;
        }

        &:hover{
           transform: scale(1.2)
        }
    }

    @media (max-width: 575.98px) {
        .icon {
            width: 14vw;
            height: 14vw;
            max-height: 45px;
        }
    }

    @media (max-width: 470px) {
        .app-logo-center{
            width: 160px;
            height: 160px;
        }
    }

    @media (max-width: 398px) {
        .app-logo-center{
            width: 150px;
            height: 150px;
        }
    }

    @media (max-width: 350px) {
        .app-logo-center{
            width: 120px;
            height: 120px;
        }
    }

`;


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

    const { isExtraSmallScreen, isMobileScreen, isTabScreen } = useResponsive()
    const isIframe = window.self !== window.top;

    useEffect(() => {
        if (circleRef.current) {
            const width = circleRef.current.offsetWidth;
            const baseRadius = isExtraSmallScreen ? (width / 1.98) : isMobileScreen ? isIframe ? (width / 2.06) : (width / 2.1) : width / 2.1;
            setCircleRadius(baseRadius - 30);
        }
    }, [circleRef.current?.offsetWidth, isMobileScreen, isTabScreen, isIframe]);

    const socailIcons = localStorage.getItem("platforms");
    const parsedSocailIcons = socailIcons ? JSON.parse(socailIcons) : [];

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
                            left: `calc(50% + ${x}px - ${isExtraSmallScreen ? '22px' : isMobileScreen ? isIframe ? '26px' : '22px' : isTabScreen ? '29px' : '27px'})`,
                            top: `calc(50% + ${y}px - ${isExtraSmallScreen ? '21px' : isMobileScreen ? isIframe ? '25px' : '20px' : isTabScreen ? '25px' : '25px'})`,
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