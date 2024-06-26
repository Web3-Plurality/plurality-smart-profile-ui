import { socialConnectButtons } from "../../common/utils";
import { useStep } from "../../context/StepContext";
import AddProfile from './../../assets/svgIcons/add-profile-icon.svg'

import './styles.css'

const DigitalWardrobeConnect = ({ selectedNFT, activeStates }: { selectedNFT: string, activeStates: boolean[] }) => {
    const { handleStepper } = useStep();
    const activeButtons = socialConnectButtons
        .filter((_, index) => activeStates[index] && index < 7)
        .map(button => (
            <img src={button.activeIcon} alt={button.displayName} />
        ));

    const handleAddProfile = (e: React.MouseEvent<HTMLImageElement>) => {
        e.stopPropagation()
        handleStepper('socialConnect')
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: "352px",
            height: "352px",
            position: 'relative'
        }}>
            <img src={selectedNFT} style={{
                width: "100%",
            }} />
            <div className="social-wardrobe-connect">
                {activeButtons}
                <img src={AddProfile} onClick={handleAddProfile} />
            </div>

        </div>

    )
}

export default DigitalWardrobeConnect
