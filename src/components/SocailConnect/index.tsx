import './styles.css';
import { socialConnectButtons } from '../../common/utils';
import CustomIcon from '../CustomIcon';
import HeaderLogo from './../../assets/svgIcons/fw-logo.svg'

interface SocialConnectProps {
    activeStates: boolean[],
    handleIconClick: (idx: number) => void
}

const SocialConnect = ({ activeStates, handleIconClick }: SocialConnectProps) => {
    const numIcons = 10;
    const circleRadius = 153;

    // Calculate the angle between each icon
    const angle = (360 / numIcons) * (Math.PI / 180); // Convert degrees to radians

    return (
        <div className="circle">
            <div className='mid-icon'>
                <img className="mvfw-logo" src={HeaderLogo} alt='' />
            </div>
            {socialConnectButtons.map(({ id, icon, activeIcon }, index) => {
                // Calculate position for each icon
                const x = circleRadius * Math.cos(angle * index);
                const y = circleRadius * Math.sin(angle * index);

                return (
                    <div
                        key={id}
                        className={`icon icon${index + 1}`}
                        style={{
                            position: "absolute",
                            left: `calc(50% + ${x}px - 27px)`, // Adjusted for icon size
                            top: `calc(50% + ${y}px - 25px)`,
                            cursor: 'pointer'
                        }}
                        onClick={() => handleIconClick(index)}
                    >
                        <CustomIcon path={activeStates[index] ? activeIcon : icon} />
                    </div>
                );
            })}
        </div>
    );
}

export default SocialConnect;
