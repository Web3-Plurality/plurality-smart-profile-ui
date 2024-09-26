import { digitalWardrobeImages } from "../../common/constants";
import { useStep } from "../../context/StepContext";
import AddProfile from './../../assets/svgIcons/add-profile-icon.svg'

import './styles.css'

interface DigitalWardrobeProps {
    activeStates: boolean[]
    handleSelectedNFT: (val: string) => void
}

const DigitalWardrobe = ({ activeStates, handleSelectedNFT }: DigitalWardrobeProps) => {
    const { handleStepper } = useStep();
    const chunkArray = () => {
        const result = [];
        for (let i = 0; i < digitalWardrobeImages.length; i += 3) {
            result.push(digitalWardrobeImages.slice(i, i + 3));
        }
        return result;
    };

    const rows = chunkArray()

    const handleNFTSelction = (img: string) => {
        handleSelectedNFT(img)
        handleStepper('digitalWardrobeConnect')
    }

    const handleAddProfile = (e: React.MouseEvent<HTMLImageElement>) => {
        e.stopPropagation()
        handleStepper('socialConnect')
    }

    // const activeButtons = socialConnectButtons
    //     .filter((_, index) => activeStates[index] && index < 7)
    //     .map(button => (
    //         <img src={button.activeIcon} alt={button.displayName} />
    //     ));
    const activeButtons = JSON.parse(localStorage.getItem("platforms")!)
        .filter((_, index) => activeStates[index] && index < 7)
        .map(button => (
            <img src={button.activeIcon} alt={button.displayName} />
        ));

    return (
        <div className="image-grid">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="image-row">
                    {row.map((image, colIndex) => (
                        <div key={colIndex} className="image-cell" onClick={() => handleNFTSelction(image)}>
                            <img src={image} alt={`Image ${rowIndex * 3 + colIndex + 1}`} />
                            <div className="social-connections" onClick={(e) => e.stopPropagation()}>
                                {activeButtons}
                                <img src={AddProfile} onClick={handleAddProfile} />
                            </div>

                        </div>
                    ))}
                </div>
            ))
            }
        </div >
    )
}

export default DigitalWardrobe
