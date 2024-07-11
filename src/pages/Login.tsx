import { useStep } from '../context/StepContext';
import WidgetLayout from '../components/appLayout';
import EmailLogin from '../components/EmailLogin';
import OTPVerification from '../components/OTPVerification';
import AuthFlow from '../components/AuthFlow';
import { getDescription, getTitleText, socialConnectButtons } from '../common/utils';
import EmailVerification from '../components/EmailVerification';
import AuthSuccess from '../components/AuthSuccess';
import SocialConnect from '../components/SocailConnect';
import { useContext, useState } from 'react';
import SocialConfirmation from '../components/SocialConfirmation';
import DigitalWardrobe from '../components/DigitaWardrobe';
import DigitalWardrobeConnect from '../components/DigitalWardrobeConnect';
import { PayloadDataType } from '../globalTypes';
import { useAccount, useConnect } from 'wagmi';
import { MetamaskActions, MetaMaskContext } from '../context/MetamaskContext';

const Login = () => {
    const { stepHistory, handleStepper, handleBack } = useStep();

    const [activeStates, setActiveStates] = useState(socialConnectButtons.map(button => button.active));
    const [selectedSocial, setSelectedSocial] = useState('')
    const [selectedNFT, setSelectedNFT] = useState('')
    const [methodId, setMethodId] = useState<string>('')
    const [finalPayload, setFinalPayload] = useState<PayloadDataType>({
        email: '',
        address: '',
        subscribe: false
    });
    const [, setUser] = useState<string>('')

    const [, dispatch] = useContext(MetaMaskContext);
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();


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
        && currentStep !== 'initial'
    // && currentStep !== 'socialConfirmation';

    const ensureMetamaskConnection = async (): Promise<boolean> => {
        console.log("Ensure MetaMask connection called");

        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            console.log("MetaMask is installed");

            // Check if MetaMask is connected
            if (!address || !isConnected) {
                // for (let i = 0; i < connectors.length; i++) {
                //     const connector = connectors[i];
                //     console.log("Trying to connect with connector: " + connectors[i].name);
                //     connect({ connector });
                // }
                const metamskConnector = connectors[0] //Metamask
                // const coinbaseWalletconnector = connectors[1] // Coinbase wallet
                connect({ connector: metamskConnector });
            }
            return true; // MetaMask is installed
        } else {
            alert("MetaMask is not installed");
            const params = new URLSearchParams(window.location.search)
            const origin = params.get('origin')!;
            window.parent.postMessage({ eventName: 'errorMessage', data: "Please install metamask" }, origin);
            return false; // MetaMask is not installed
        }
    };


    const handleMetamaskConnect = async () => {
        try {
            if (setUser) setUser("user");
            //TODO need to find a way of how to selectivly connect
            await ensureMetamaskConnection();
        } catch (e) {
            console.error(e);
            dispatch({ type: MetamaskActions.SetError, payload: e });
        }
    };


    const conditionalRendrer = () => {
        const currentStep = stepHistory[stepHistory.length - 1];
        switch (currentStep) {
            case 'initial':
                return <AuthFlow handleStepper={handleStepper} auth={'login'} handleMetamaskConnect={handleMetamaskConnect} />;
            case 'login':
                return <EmailLogin handleStepper={handleStepper} handleMethodId={handleMethodId} />;
            case 'register':
                return <AuthFlow handleStepper={handleStepper} auth={'register'} handleMetamaskConnect={handleMetamaskConnect} />;
            case 'otp':
                return <OTPVerification
                    address='0x29839afghgrkmfvllkajfjoiweqryewurfvbsvaqdwre' // TO DO (metamask connection)
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
