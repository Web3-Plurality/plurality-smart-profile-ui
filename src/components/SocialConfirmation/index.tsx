import CustomButtom from '../CustomButton'
import { SocialProfileUrls } from '../../common/constants'
import './styles.css'

type SocialConfirmationProps = {
    selectedProfile: string
    previousStep: string
    handleStepper: (step: string) => void
}

const SocialConfirmation = ({ selectedProfile, previousStep, handleStepper }: SocialConfirmationProps) => {
    const showConnectedProfile = previousStep === 'socialConnect'

    const goToProfile = () => {
        const url = SocialProfileUrls[selectedProfile as keyof typeof SocialProfileUrls];
        window.open(url, '_blank');
        handleStepper('metaverseHub')
    }

    return (
        <>
            <p className='social-connect-text'>{`Continue to ${showConnectedProfile ? 'Your' : ''}`}</p>
            <p className='social-connect-text'>{`${showConnectedProfile ? 'Metaverse Hub' : selectedProfile}?`}</p>
            <CustomButtom handleClick={showConnectedProfile ? () => handleStepper('metaverseHub') : () => goToProfile()} text={`Let's Go`} />
        </>
    )
}

export default SocialConfirmation
