import { socialConnectButtons } from '../../common/utils';
import CustomIcon from '../CustomIcon';
import HeaderLogo from './../../assets/svgIcons/fw-logo.svg'
import './styles.css'

type MetaverseProps = {
    metaverse?: boolean,
    handleIconClick?: (id: number) => void
    handleClick?: (val: string) => void
    activeStates?: boolean[]
}

const SocialProfiles = ({
    metaverse,
    activeStates,
    handleIconClick,
    handleClick
}: MetaverseProps) => {

    const numIcons = 8;
    const circleRadius = 153;

    // Calculate the angle between each icon
    const angle = (360 / numIcons) * (Math.PI / 180); // Convert degrees to radians

    const getSocialIconPath = (id: number, icon: string, activeIcon: string) => {
        if (metaverse) return activeIcon;
        return activeStates?.[id] ? activeIcon : icon;
    }

    const selectProfile = (id: number, iconName: string) => {
        if (metaverse) {
            handleClick?.(iconName)
        } else {
            handleIconClick?.(id)
        }
    }

    return (
        <div className="circle">
            <div className='mid-icon'>
                <img className="mvfw-logo" src={HeaderLogo} alt='' />
            </div>
            {socialConnectButtons.map(({ id, icon, activeIcon, displayName }) => {
                // Calculate position for each icon
                const x = circleRadius * Math.cos(angle * id);
                const y = circleRadius * Math.sin(angle * id);

                return (
                    <div
                        key={id}
                        className={`icon icon${id}`}
                        style={{
                            position: "absolute",
                            left: `calc(50% + ${x}px - 27px)`, // Adjusted for icon size
                            top: `calc(50% + ${y}px - 25px)`,
                            cursor: 'pointer'
                        }}
                        onClick={() => selectProfile(id, displayName)}
                    >
                        <CustomIcon path={getSocialIconPath(id, icon, activeIcon)} />
                    </div>
                );
            })}
        </div>
    )
}

export default SocialProfiles

