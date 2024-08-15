import CustomButtom from '../CustomButton'
import './styles.css'

const SocialConfirmation = ({ selectedProfile, previousStep, handleStepper }: { selectedProfile: string, previousStep: string, handleStepper: (step: string) => void }) => {
    const showConnectedProfile = previousStep === 'socialConnect'
    return (
        <>
            <p className='social-connect-text'>{`Continue to ${showConnectedProfile ? 'Your' : ''}`}</p>
            <p className='social-connect-text'>{`${showConnectedProfile ? 'Metaverse Hub' : selectedProfile}?`}</p>
            <CustomButtom handleClick={showConnectedProfile ? () => handleStepper('metaverseHub') : () => { }} text={`Let's Go`} />
        </>
    )
}

export default SocialConfirmation
