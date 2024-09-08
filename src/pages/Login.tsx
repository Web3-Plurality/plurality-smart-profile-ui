/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { message } from 'antd';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
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
    encryptData,
    getDescription,
    getTitleText,
    showBackButton,
    showHeader
} from '../common/utils';
import { PayloadDataType } from '../globalTypes';
import { useRegisterEvent } from '../common/eventListner';
import MetaverseHub from '../components/MetaverseHub';
import { BASE_URL, metaverseHubButtons, socialConnectButtons } from '../common/constants';
import { MessageType } from 'antd/es/message/interface';
import { useMetamaskToken } from '../hooks/useMetamaskToken';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../components/LogoutModal';
import axios from 'axios';
import { useMetamaskPublicKey } from '../hooks/useMetamaskPublicKey';
import { insertSmartProfile } from '../common/orbis';

const Login = () => {
    const { stepHistory, handleStepper, handleBack } = useStep();
    const { disconnectAsync } = useDisconnect();
    const navigate = useNavigate()
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
    const { getPublicKey } = useMetamaskPublicKey()


    const {
        message: eventMessage,
        app,
        isLoading: infoLoading,
        registerEvent,
    } = useRegisterEvent()

    // const {
    //     sumbitDataToOrbis,
    //     isLoading: orbisLoading
    // } = useOrbisHandler()

    const getLatestSmartProfile = async () => {
        const presentSmartProfileData = localStorage.getItem('smartProfileData')
        const token = localStorage.getItem('token')
        if (presentSmartProfileData) {
            const { data } = await axios.post(`${BASE_URL}/user/smart-profile`, { smartProfile: JSON.parse(presentSmartProfileData) }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                console.log("Data of smart profile: ", data)
                const litSignature = localStorage.getItem("signature")
                let publicKey;
                if (!litSignature) {
                    publicKey = await getPublicKey()
                }
                const result = await encryptData(JSON.stringify(data), publicKey)
                console.log("encryption result: ", result)

                //const decryptedData = decryptData(JSON.stringify(result), '')
                //console.log("encryption result: ", decryptedData)

                const insertionResult = await insertSmartProfile(JSON.stringify(result), JSON.stringify(data.smartProfile.scores), '1', JSON.stringify(data.smartProfile.connected_platforms))
                // save smart profile in local storage along with the returned stream id
                if (insertionResult) {
                    const objData = {
                        streamId: insertionResult?.id,
                        data
                    }
                    localStorage.setItem('smartProfileData', JSON.stringify(objData))
                    handleStepper('metaverseHub')
                }

            }
        }
    }

    const {
        generateMetamaskToken,
        error: metmaskLoginError,
        setError
        // isLoading: nonceLoading
    } = useMetamaskToken()



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



    useEffect(() => {
        const token = localStorage.getItem('token')
        if (isConnected && !token) {
            generateMetamaskToken()
        }
    }, [isConnected])

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
        // We minus 2 here because in the metaverse hub, we dont need meta and decentraland
        const isIndexValid = index < socialConnectButtons.length - 2;

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
            const smartProfileData = localStorage.getItem('smartProfileData')
            const connectedPlatforms = smartProfileData ? JSON.parse(smartProfileData).data.smartProfile.connected_profiles : []
            const clickedIconDisplayName = socialConnectButtons[index].displayName.toLowerCase().replace(/\s+/g, '');
            if (!connectedPlatforms.includes(clickedIconDisplayName)) {
                // const clickedIconDisplayName = socialConnectButtons[index].displayName.toLowerCase();
                setActiveIndex(index);
                console.log("clickedIconDisplayName", clickedIconDisplayName);
                registerEvent(clickedIconDisplayName);
            }
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


    const allowContinue = (activeStates.filter((item) => item && activeStates.indexOf(item) !== 6 && activeStates.indexOf(item) !== 7)).length > 0

    const currentStep = stepHistory[stepHistory.length - 1];
    const isBackButton = showBackButton(currentStep)

    const ensureMetamaskConnection = async (): Promise<boolean> => {
        console.log("Ensure MetaMask connection called");

        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            console.log("MetaMask is installed");

            // Check if MetaMask is connected
            if (!metamaskAddress || !isConnected) {
                await disconnectAsync()
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

    async function handleLogout() {
        try {
            await disconnectAsync();
        } catch (err) {
            console.error(err);
        }
        const smartprofileData = localStorage.getItem("smartProfileData")
        localStorage.clear();
        localStorage.setItem("smartProfileData", smartprofileData || '')
        handleStepper("initial")
        navigate('/', { replace: true });
    }

    const handleOk = async () => {
        generateMetamaskToken()
        setError(false)
    }
    const handleCancel = async () => {
        await handleLogout()
        setError(false)
    }

    return (
        <>
            <LogoutModal
                isVisible={metmaskLoginError}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />
            {/* <Modal
                open={metmaskLoginError}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Yes"
                cancelText="NO"
            >
                <p>Are you sure? In this case you will be logged out</p>
            </Modal> */}
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
                // orbisLoading={orbisLoading}
                selectedSocial={selectedSocial}
                sumbitDataToOrbis={getLatestSmartProfile}

            >
                {conditionalRendrer()}
            </WidgetLayout >
        </>
    );
};

export default Login;
