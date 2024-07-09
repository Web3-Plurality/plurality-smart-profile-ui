import { useStep } from '../context/StepContext';
import WidgetLayout from '../components/appLayout';
import EmailLogin from '../components/EmailLogin';
import OTPVerification from '../components/OTPVerification';
import AuthFlow from '../components/AuthFlow';
import { getDescription, getTitleText, socialConnectButtons } from '../common/utils';
import EmailVerification from '../components/EmailVerification';
import AuthSuccess from '../components/AuthSuccess';
import SocialConnect from '../components/SocailConnect';
import { useState } from 'react';
import SocialConfirmation from '../components/SocialConfirmation';
import DigitalWardrobe from '../components/DigitaWardrobe';
import DigitalWardrobeConnect from '../components/DigitalWardrobeConnect';
import { PayloadDataType } from '../globalTypes';

const Login = () => {
    const { stepHistory, handleStepper, handleBack } = useStep();

    const [activeStates, setActiveStates] = useState(socialConnectButtons.map(button => button.active));
    const [selectedSocial, setSelectedSocial] = useState('')
    const [selectedNFT, setSelectedNFT] = useState('')
    const [methodId, setMethodId] = useState<string>('')
    const [finalPayload, setFinalPayload] = useState<PayloadDataType>({
        session: '',
        userId: '',
        method: 'email'
    });


    const handleIconClick = (index: number) => {
        if (activeStates[index]) {
            setSelectedSocial(socialConnectButtons[index].displayName)
            handleStepper('socialConfirmation')
        } else {
            const newActiveStates = [...activeStates];
            newActiveStates[index] = !newActiveStates[index];
            setActiveStates(newActiveStates);
        }
    };

    const handleSelectedNFT = (nft: string) => {
        setSelectedNFT(nft)
    }

    const handleMethodId = (id: string) => {
        setMethodId(id)
    }

    const handleFinalPayload = (data: PayloadDataType) => {
        setFinalPayload(data)
    }

    const allowContinue = (activeStates.filter((item) => item)).length > 0


    const currentStep = stepHistory[stepHistory.length - 1];
    // const previousStep = stepHistory[stepHistory.length - 2];
    const showBackButton = stepHistory.length > 1
        && currentStep !== 'success'
        && currentStep !== 'socialConnect'
    // && currentStep !== 'socialConfirmation';


    const conditionalRendrer = () => {
        const currentStep = stepHistory[stepHistory.length - 1];
        switch (currentStep) {
            case 'initial':
                return <AuthFlow handleStepper={handleStepper} auth={'login'} />;
            case 'login':
                return <EmailLogin handleStepper={handleStepper} handleMethodId={handleMethodId} />;
            case 'register':
                return <AuthFlow handleStepper={handleStepper} auth={'register'} />;
            case 'otp':
                return <OTPVerification
                    methodId={methodId}
                    handleStepper={handleStepper}
                    handleFinalPayload={handleFinalPayload}
                />;
            case 'verification':
                return <EmailVerification handleStepper={handleStepper} finalPayload={finalPayload} />
            case 'success':
                return <AuthSuccess handleStepper={handleStepper} />
            case 'socialConnect':
                return <SocialConnect handleIconClick={handleIconClick} activeStates={activeStates} />
            case 'socialConfirmation':
                return <SocialConfirmation selectedSocial={selectedSocial} />
            case 'digitalWardrobe':
                return <DigitalWardrobe handleSelectedNFT={handleSelectedNFT} activeStates={activeStates} />
            case 'digitalWardrobeConnect':
                return <DigitalWardrobeConnect selectedNFT={selectedNFT} activeStates={activeStates} />
            default:
                return <div>Test div</div>;
        }
    };

    return (
        <WidgetLayout
            currentStep={currentStep === 'success'}
            showBackButton={showBackButton}
            handleBack={handleBack}
            title={getTitleText(stepHistory)}
            description={getDescription(stepHistory)}
            showHeaderLogo={currentStep !== 'socialConnect'
            }
            showBackgroundImage={currentStep === 'socialConfirmation'}
            socialsFooter={allowContinue ? 'Continue' : 'Skip for now'}
        >
            {conditionalRendrer()}
        </WidgetLayout >
    );
};

export default Login;
