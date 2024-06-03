import { useStep } from '../context/StepContext'; // Adjust the import path accordingly
import WidgetLayout from '../components/appLayout';
import EmailLogin from '../components/EmailLogin';
import OTPVerification from '../components/OTPVerification';
import AuthFlow from '../components/AuthFlow';
import { getDescription, getTitleText } from '../common/utils';
import EmailVerification from '../components/EmailVerification';
import AuthSuccess from '../components/AuthSuccess';
import SocialConnect from '../components/SocailConnect';

const Login = () => {
    const { stepHistory, handleStepper, handleBack } = useStep();


    const currentStep = stepHistory[stepHistory.length - 1];
    const previousStep = stepHistory[stepHistory.length - 2];
    const showBackButton = stepHistory.length > 1 && currentStep !== 'success' && currentStep !== 'socialConnect';

    const conditionalRendrer = () => {
        const currentStep = stepHistory[stepHistory.length - 1];
        switch (currentStep) {
            case 'initial':
                return <AuthFlow handleStepper={handleStepper} auth={'login'} />;
            case 'login':
                return <EmailLogin handleStepper={handleStepper} prevStep={previousStep} />;
            case 'register':
                return <AuthFlow handleStepper={handleStepper} auth={'register'} />;
            case 'otp':
                return <OTPVerification handleStepper={handleStepper} />;
            case 'verification':
                return <EmailVerification handleStepper={handleStepper} />
            case 'success':
                return <AuthSuccess handleStepper={handleStepper} />
            case 'socialConnect':
                return <SocialConnect />
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
        >
            {conditionalRendrer()}
        </WidgetLayout>
    );
};

export default Login;
