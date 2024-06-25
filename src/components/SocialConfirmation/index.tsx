import CustomButtom from '../CustomButton'
import './styles.css'

const SocialConfirmation = ({ selectedSocial }: { selectedSocial: string }) => {
    return (
        <>
            <p className='social-connect-text'>{`Continue to`}</p>
            <p className='social-connect-text'>{`${selectedSocial}?`}</p>
            <CustomButtom text={`Let's Go`} />
        </>
    )
}

export default SocialConfirmation
