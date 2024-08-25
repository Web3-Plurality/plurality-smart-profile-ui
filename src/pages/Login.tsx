/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { message } from 'antd';
import { useAccount, useConnect } from 'wagmi';
import { useStep } from '../context/StepContext';
import WidgetLayout from '../components/appLayout';
import EmailLogin from '../components/EmailLogin';
import OTPVerification from '../components/OTPVerification';
import AuthFlow from '../components/AuthFlow';
import EmailVerification from '../components/EmailVerification';
import AuthSuccess from '../components/AuthSuccess';
import SocialConnect from '../components/SocialConnect';
import SocialConfirmation from '../components/SocialConfirmation';
import DigitalWardrobe from '../components/DigitaWardrobe';
import DigitalWardrobeConnect from '../components/DigitalWardrobeConnect';
import Dashboard from '../components/LitComponents/Dashboard';
import ProfileSettings from '../components/ProfileSettings';
import {
    getDescription,
    getTitleText,
    showBackButton,
    showHeader
} from '../common/utils';
import { PayloadDataType } from '../globalTypes';
import { useRegisterEvent } from '../common/eventListner';
import MetaverseHub from '../components/MetaverseHub';
import { useOrbisHandler } from '../hooks/useOrbishandler';
import { metaverseHubButtons, socialConnectButtons } from '../common/constants';
import { MessageType } from 'antd/es/message/interface';



const Login = () => {
    const { stepHistory, handleStepper, handleBack } = useStep();
    const warningMessageRef = useRef<MessageType | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [activeStates, setActiveStates] = useState(socialConnectButtons.map(button => button.active));
    const [selectedSocial, setSelectedSocial] = useState('')
    const [selectedNFT, setSelectedNFT] = useState('')
    const [methodId, setMethodId] = useState<string>('')
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [finalPayload, setFinalPayload] = useState<PayloadDataType>({
        session: '',
        userId: '',
        method: 'email'
    });

    const previousStep = stepHistory[stepHistory.length - 2]

    const [, setUser] = useState<string>('')
    const { address: metamaskAddress, isConnected } = useAccount();
    const { connect, connectors } = useConnect();

    const {
        message: eventMessage,
        app,
        isLoading: infoLoading,
        registerEvent,
    } = useRegisterEvent();

    const {
        sumbitDataToOrbis,
        isLoading: orbisLoading
    } = useOrbisHandler()

    useEffect(() => {
        if (eventMessage === 'received') {
            const newActiveStates = [...activeStates];
            if (activeIndex !== null) {
                newActiveStates[activeIndex] = !newActiveStates[activeIndex];
            }
            setActiveStates(newActiveStates);
            setIsLoading(false)
        }
    }, [eventMessage, app]);

    const widgetHeader = document.getElementById('w-header');
    widgetHeader?.classList.remove('toogleShow')

    const storedLitAccount = localStorage.getItem('lit-wallet-sig')
    let litAddress = ''
    if (storedLitAccount) {
        litAddress = JSON.parse(storedLitAccount).address
    }

    useEffect(() => {
        if (metamaskAddress && currentStep === 'initial') {
            handleStepper("success")
        } else if (litAddress || metamaskAddress) {
            handleStepper(currentStep)
        } else {
            if (showHeader(currentStep)) {
                handleStepper('initial')
            }
        }
    }, [metamaskAddress])

    const handleIconClick = (index: number) => {
        const profiles = currentStep === 'metaverseHub' ? metaverseHubButtons : socialConnectButtons;

        const isMetaverseHub = currentStep === 'metaverseHub';
        const isIndexValid = index < socialConnectButtons.length;

        const handleMetaverseHubClick = () => {
            if (activeStates[index] || !isIndexValid) {
                handleStepper('socialConfirmation');
                setSelectedSocial(profiles[index].displayName);
            } else {
                if (warningMessageRef.current) {
                    warningMessageRef.current();
                    warningMessageRef.current = null;
                }
                warningMessageRef.current = message.warning('Please connect this profile first!');
            }
        };

        const handleSocialConnectClick = () => {
            const clickedIconDisplayName = socialConnectButtons[index].displayName.toLowerCase();
            setActiveIndex(index);
            console.log("clickedIconDisplayName", clickedIconDisplayName);
            registerEvent(clickedIconDisplayName);
        };

        if (isMetaverseHub) {
            handleMetaverseHubClick();
        } else if (!activeStates[index]) {
            handleSocialConnectClick();
        } else {
            setSelectedSocial(profiles[index].displayName);
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

    const handleVerificationError = () => {
        handleStepper('initial');
        message.error('Something went wrong. Please try again.');
    }


    const allowContinue = (activeStates.filter((item) => item)).length > 0

    const currentStep = stepHistory[stepHistory.length - 1];
    const isBackButton = showBackButton(currentStep)

    const ensureMetamaskConnection = async (): Promise<boolean> => {
        console.log("Ensure MetaMask connection called");

        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            console.log("MetaMask is installed");

            // Check if MetaMask is connected
            if (!metamaskAddress || !isConnected) {
                const metamskConnector = connectors[0] //Metamask
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
            await ensureMetamaskConnection();
        } catch (e) {
            console.error(e);
        }
    };


    const conditionalRendrer = () => {
        const currentStep = stepHistory[stepHistory.length - 1];
        switch (currentStep) {
            case 'initial':
                return <AuthFlow handleStepper={handleStepper} handleMetamaskConnect={handleMetamaskConnect} />
            case 'login':
                return <EmailLogin handleMethodId={handleMethodId} />;
            case 'otp':
                return <OTPVerification handleStepper={handleStepper} methodId={methodId} handleFinalPayload={handleFinalPayload} />
            case 'verification':
                return <EmailVerification handleStepper={handleStepper} finalPayload={finalPayload} onError={handleVerificationError} />
            case 'success':
                return <AuthSuccess handleStepper={handleStepper} />
            case 'socialConnect':
                return <SocialConnect handleIconClick={handleIconClick} activeStates={activeStates} />
            case 'socialConfirmation':
                return <SocialConfirmation handleStepper={handleStepper} selectedProfile={selectedSocial} previousStep={previousStep} />
            case 'metaverseHub':
                return <MetaverseHub handleIconClick={handleIconClick} activeStates={activeStates} />
            case 'digitalWardrobe':
                return <DigitalWardrobe handleSelectedNFT={handleSelectedNFT} activeStates={activeStates} />
            case 'digitalWardrobeConnect':
                return <DigitalWardrobeConnect selectedNFT={selectedNFT} activeStates={activeStates} />
            case 'dashboard':
                return <Dashboard currentAccount={litAddress} handleStepper={handleStepper} />
            case 'profileSettings':
                return <ProfileSettings />
            default:
                return <div>Something went wrong!</div>;
        }
    };

    return (
        <WidgetLayout
            currentStep={currentStep === 'success'}
            showBackButton={isBackButton}
            handleBack={handleBack}
            // handlefooterClick={ }
            title={getTitleText(stepHistory)}
            description={getDescription(stepHistory)}
            showHeaderLogo={
                currentStep !== 'socialConnect' &&
                currentStep !== 'metaverseHub'
            }
            showBackgroundImage={currentStep === 'socialConfirmation'}
            socialsFooter={allowContinue ? 'Continue' : 'Skip for now'}
            isLoading={isLoading}
            infoLoading={infoLoading}
            orbisLoading={orbisLoading}
            selectedSocial={selectedSocial}
            sumbitDataToOrbis={sumbitDataToOrbis}

        >
            {conditionalRendrer()}
        </WidgetLayout >
    );
};

export default Login;
