import { useEffect } from 'react';
import { socialConnectButtons } from '../../common/constants';
import CustomIcon from '../CustomIcon';
import HeaderLogo from './../../assets/svgIcons/app-logo.png'
import './styles.css'


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
    handleIconClick: (id: number) => void
    activeStates: boolean[]
}

const SocialProfiles = ({
    activeStates,
    handleIconClick,
}: MetaverseProps) => {

    // const numIcons = metaverse ? metaverseHubButtons.length : socialConnectButtons.length;
    const numIcons = socialConnectButtons.length
    const circleRadius = 153;

    // Calculate the angle between each icon
    const angle = (360 / numIcons) * (Math.PI / 180); // Convert degrees to radians

    // const profiles = metaverse ? metaverseHubButtons : socialConnectButtons
    const socailIcons = localStorage.getItem("platforms")
    const parsedSocailIcons = socailIcons ? JSON.parse(socailIcons) : ''

    const updateLocalStoragePlatforms = (activeStates: boolean[]) => {
        // Get current platforms from local storage
        const platforms = localStorage.getItem("platforms");
        const parsedPlatforms = platforms ? JSON.parse(platforms) : [];

        // Update the active state based on `activeStates`
        const updatedPlatforms = parsedPlatforms.map((platform: Platform) => ({
            ...platform,
            active: platform.active ? true : activeStates[platform.id] || false
        }));

        // Save the updated platforms back to local storage
        localStorage.setItem("platforms", JSON.stringify(updatedPlatforms));
    };

    useEffect(() => {
        updateLocalStoragePlatforms(activeStates);
    }, [activeStates]);

    const smartProfileData = localStorage.getItem('smartProfileData')
    const connectedPlatforms = smartProfileData ? JSON.parse(smartProfileData).data.smartProfile.connected_platforms : []
    return (
        <div className="circle">
            <div className='mid-icon'>
                <img className="app-logo-center" src={HeaderLogo} alt='' />
            </div>
            {parsedSocailIcons && parsedSocailIcons.map(({ iconName, id, icon, activeIcon }: { iconName: string, id: number, icon: string, activeIcon: string }) => {
                // Calculate position for each icon
                const x = circleRadius * Math.cos(angle * id);
                const y = circleRadius * Math.sin(angle * id);

                return (
                    <div
                        key={id}
                        className={`icon icon${id}`}
                        style={{
                            position: "absolute",
                            left: `calc(50% + ${x}px - 27px)`,
                            top: `calc(50% + ${y}px - 25px)`,
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
    )
}

export default SocialProfiles

