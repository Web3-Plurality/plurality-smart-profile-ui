import { useEffect, useRef, useState } from 'react';
import { socialConnectButtons } from '../../common/constants';
import CustomIcon from '../CustomIcon';
import HeaderLogo from './../../assets/svgIcons/app-logo.png';
import './styles.css';

type Platform = {
    active: boolean,
    activeIcon: string,
    displayName: string,
    icon: string,
    iconName: string,
    id: number
}

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

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 576);
    const [isTabScreen, setIstabScreen] = useState(window.innerWidth <= 834);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth <= 576);
        const handleResizeTab = () => setIstabScreen(window.innerWidth <= 834)

        window.addEventListener('resize', handleResize);
        window.addEventListener('resizeTab', handleResizeTab);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('resizeTab', handleResize);
        }
    }, []);

    useEffect(() => {
        if (circleRef.current) {
            const width = circleRef.current.offsetWidth;
            const radSize = isSmallScreen ? 2 : 2.1
            setCircleRadius(width / radSize - 30); // Adjust radius if necessary
        }
    }, [circleRef.current?.offsetWidth, isSmallScreen]);

    const numIcons = socialConnectButtons.length;

    // Calculate the angle between each icon
    const angle = (360 / numIcons) * (Math.PI / 180); // Convert degrees to radians

    const socailIcons = localStorage.getItem("platforms");
    const parsedSocailIcons = socailIcons ? JSON.parse(socailIcons) : [];

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

    return (
        <div ref={circleRef} className="circle">
            <div className='mid-icon'>
                <img className="app-logo-center" src={HeaderLogo} alt='' />
            </div>
            {parsedSocailIcons && parsedSocailIcons.map(({ iconName, id, icon, activeIcon }: { iconName: string, id: number, icon: string, activeIcon: string }) => {
                const x = circleRadius * Math.cos(angle * id);
                const y = circleRadius * Math.sin(angle * id);

                return (
                    <div
                        key={id}
                        className={`icon icon${id}`}
                        style={{
                            position: "absolute",
                            left: `calc(50% + ${x}px - ${isSmallScreen ? '23px' : isTabScreen ? '29px' : '27px'})`,
                            top: `calc(50% + ${y}px - ${isSmallScreen ? '20px' : isTabScreen ? '25px' : '25px'})`,
                            cursor: 'pointer'
                        }}
                        onClick={() => handleIconClick(id)}
                    >
                        <CustomIcon
                            path={activeStates[id] ||
                                parsedSocailIcons[id].active ||
                                connectedPlatforms?.includes(iconName)
                                ? activeIcon : icon} />
                    </div>
                );
            })}
        </div>
    );
}

export default SocialProfiles;
