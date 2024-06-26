import { useStep } from '../../context/StepContext';
import CustomIcon from '../CustomIcon'
import BadgeIcon from './../../assets/svgIcons/badge-icon.svg'
import './styles.css'

const Header = () => {
    const { stepHistory, handleStepper } = useStep();
    const currentStep = stepHistory[stepHistory.length - 1];
    console.log("Current Step: ", currentStep)

    if (
        currentStep !== 'success'
        && currentStep !== 'socialConnect'
        && currentStep !== 'socialConfirmation'
        && currentStep !== 'digitalWardrobe'
        && currentStep !== 'digitalWardrobeConnect'
    ) return

    return (
        <div className='header-wrapper'>
            <div className='user-detail'>
                <div className='user-info'>
                    <span>John Doe</span>
                    <div className='icon-box'>
                        <CustomIcon path={BadgeIcon} />
                    </div>
                </div>
                <div className="avatar" role="button"
                    tabIndex={0}
                    onClick={() => handleStepper('digitalWardrobe')}>

                </div>
            </div>
        </div>
    )
}

export default Header
