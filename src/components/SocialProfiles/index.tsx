import { socialConnectButtons, metaverseHubButtons } from '../../common/constants';
import CustomIcon from '../CustomIcon';
import HeaderLogo from './../../assets/svgIcons/app-logo.png'
import './styles.css'

type MetaverseProps = {
    metaverse?: boolean,
    handleIconClick: (id: number) => void
    activeStates: boolean[]
}

const SocialProfiles = ({
    metaverse,
    activeStates,
    handleIconClick,
}: MetaverseProps) => {

    const numIcons = metaverse ? metaverseHubButtons.length : socialConnectButtons.length;
    const circleRadius = 153;

    // Calculate the angle between each icon
    const angle = (360 / numIcons) * (Math.PI / 180); // Convert degrees to radians

    const profiles = metaverse ? metaverseHubButtons : socialConnectButtons

    return (
        <div className="circle">
            <div className='mid-icon'>
                <img className="app-logo-center" src={HeaderLogo} alt='' />
            </div>
            {profiles.map(({ id, icon, activeIcon }) => {
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
                        <CustomIcon path={activeStates[id] ? activeIcon : icon} />
                    </div>
                );
            })}
        </div>
    )
}

export default SocialProfiles

