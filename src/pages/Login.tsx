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
    isProfileConnectPlatform,
    isRsmPlatform,
    showBackButton,
    showHeader
} from '../common/utils';
import { PayloadDataType, ProfileData } from '../globalTypes';
import { useRegisterEvent } from '../common/eventListner';
import { BASE_URL, CLIENT_ID, metaverseHubButtons, socialConnectButtons } from '../common/constants';
import { MessageType } from 'antd/es/message/interface';
import { useMetamaskToken } from '../hooks/useMetamaskToken';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../components/LogoutModal';
import axios from 'axios';
import { useMetamaskPublicKey } from '../hooks/useMetamaskPublicKey';
import { connectOrbisDidPkh, insertSmartProfile, select } from '../common/orbis';
import { AuthUserInformation } from '@useorbis/db-sdk';

const Login = () => {
    const { stepHistory, handleStepper, handleBack } = useStep();
    const { disconnectAsync } = useDisconnect();
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const warningMessageRef = useRef<MessageType | null>(null);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 834);
    const [isLoading, setIsLoading] = useState<boolean>(!!clientId)

    const [socialButtons, setSocialButtons] = useState<ProfileData[]>([])
    // I am actually not sure if we can reference a state inside another state??
    const [activeStates, setActiveStates] = useState<boolean[]>(
        socialButtons.map(button => button.active ?? false)
    );

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

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth <= 576);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('resizeTab', handleResize);
        }
    }, []);

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
                const litSignature = localStorage.getItem("signature")
                let publicKey;
                if (!litSignature) {
                    publicKey = await getPublicKey();
                }
                const result = await encryptData(JSON.stringify(data.smartProfile), publicKey)

                const stream_id = localStorage.getItem("streamId")!
                const insertionResult = await insertSmartProfile(JSON.stringify(result), JSON.stringify(data.smartProfile.scores), '1', JSON.stringify(data.smartProfile.connected_platforms), stream_id)
                // save smart profile in local storage along with the returned stream id
                if (insertionResult) {
                    const objData = {
                        streamId: insertionResult?.id,
                        data: { smartProfile: data.smartProfile }
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
        setError,
        ceramicError,
        setCeramicError
        // isLoading: nonceLoading
    } = useMetamaskToken()


    useEffect(() => {
        // We need tp use this clientId to load the logo
        if (clientId) {
            setIsLoading(true)
            localStorage.setItem('clientId', clientId)
            const domain = window.location.ancestorOrigins.length > 0 ? window.location.ancestorOrigins[0] : window.location.origin
            const fetchData = async () => {
                try {
                    const rsmUrl = `${BASE_URL}/rsm?uuid=${clientId}`
                    const { data } = await axios.get(rsmUrl, {
                        headers: {
                            'x-domain': domain
                        }
                    })
                    console.log("Data", data)
                    if (!data.data) return
                    if (data.error) {
                        console.log("here 1")
                        message.error(data.error)
                        return
                    }
                    // store the streamID, log and links in localstorage
                    localStorage.setItem('streamId', data.data.streamId)
                    localStorage.setItem('logo', data.data.logo)
                    localStorage.setItem('links', data.data.links)
                    localStorage.setItem('incentives', data.data.incentiveType)

                    //firstly initilize the roulette constant
                    const selectedResult = await select(data.data.streamId)
                    if (selectedResult?.neededPlatforms) {
                        setSocialButtons(selectedResult?.neededPlatforms);
                    }
                    // store those in localhsot
                    console.log(selectedResult)
                    localStorage.setItem("platforms", JSON.stringify(selectedResult?.neededPlatforms))
                    localStorage.setItem("platformName", JSON.stringify(selectedResult?.rows[0].profile_name))
                    localStorage.setItem("platformDescription", JSON.stringify(selectedResult?.rows[0].description))
                    setIsLoading(false)
                } catch (fetchError) {
                    message.error('API request failed!');
                    console.error("Fetch error:", fetchError);
                } finally {
                    setIsLoading(false)
                }

            }
            fetchData()
        } else {
            setSocialButtons(socialConnectButtons);
            localStorage.setItem("platforms", JSON.stringify(socialConnectButtons))
        }
    }, [clientId]);

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
        const profiles = currentStep === 'metaverseHub' ? metaverseHubButtons : socialButtons;

        const isMetaverseHub = currentStep === 'metaverseHub';
        // We minus 2 here because in the metaverse hub, we dont need meta and decentraland
        const isIndexValid = index < socialButtons?.length - 2;


        const handleMetaverseHubClick = () => {
            const smartProfileData = localStorage.getItem('smartProfileData')
            const connectedPlatforms = smartProfileData ? JSON.parse(smartProfileData).data.smartProfile.connected_platforms : []
            const clickedIconDisplayName = socialButtons[index]?.displayName?.toLowerCase().replace(/\s+/g, '');

            if (activeStates[index] || !isIndexValid || connectedPlatforms.includes(clickedIconDisplayName)) {
                handleStepper('socialConfirmation');
                if (profiles[index].displayName) {
                    setSelectedSocial(profiles[index].displayName);
                }
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
            const platforms = localStorage.getItem('platforms')
            const parsedPlatforms = platforms ? JSON.parse(platforms) : []
            const connectedPlatforms = smartProfileData ? JSON.parse(smartProfileData).data.smartProfile.connected_platforms : []
            const filteredProfile = socialButtons.filter((button: ProfileData) => button.id === index)
            const clickedIconDisplayName = filteredProfile[0]?.displayName?.toLowerCase().replace(/\s+/g, '');
            const activePlatforms: string[] = []
            parsedPlatforms?.forEach((platform: ProfileData) => {
                if (platform.active) {
                    activePlatforms.push(platform.displayName!.toLowerCase().replace(/\s+/g, ''));
                }
            });
            if (!connectedPlatforms.includes(clickedIconDisplayName) && !activePlatforms?.includes(clickedIconDisplayName || '')) {
                setActiveIndex(index);
                if (clickedIconDisplayName) {
                    registerEvent(clickedIconDisplayName);
                }
            } else if (window.location.pathname === '/rsm' || window.location.pathname === '/') {
                const storedUrls = localStorage.getItem('links')
                const parsedUrls = storedUrls ? JSON.parse(storedUrls) : []
                const clickedIcon = socialButtons?.find((x: ProfileData) => x?.id === index);
                const clickedIconDisplayName = clickedIcon?.displayName?.toLowerCase().replace(/\s+/g, '')
                const selectedItem = parsedUrls.find((item: ProfileData) => item?.platformName?.toLowerCase() === clickedIconDisplayName)
                window.open(selectedItem?.url, '_blank');
            }
        };

        if (isMetaverseHub) {
            handleMetaverseHubClick();
        } else {
            handleSocialConnectClick();
        }
        // if (isMetaverseHub) {
        //     handleMetaverseHubClick();
        // } else if (!activeStates[index]) {
        //     handleSocialConnectClick();
        // } else {
        //     // setSelectedSocial(profiles[index].displayName);
        // }
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

    const currentStep = stepHistory[stepHistory.length - 1];
    const isBackButton = showBackButton(currentStep)

    const ensureMetamaskConnection = async (): Promise<boolean> => {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {

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
        if (isSmallScreen) {
            if (warningMessageRef.current) {
                warningMessageRef.current();
                warningMessageRef.current = null;
            }
            warningMessageRef.current = message.warning('Device not supported for Metamask connection!');
            return;
        }
        try {
            if ((localStorage.getItem('tool') as string) !== 'metamask') {
                const streamId = localStorage.getItem('streamId')
                const logo = localStorage.getItem('logo')
                const links = localStorage.getItem('links')
                const platforms = localStorage.getItem("platforms")
                const clientId = localStorage.getItem("clientId")
                const incentiveType = localStorage.getItem('incentives')
                const platformName = localStorage.getItem('platformName')
                const platformDescription = localStorage.getItem('platformDescription')

                localStorage.clear()
                localStorage.setItem('streamId', streamId || '')
                localStorage.setItem('logo', logo || '')
                localStorage.setItem('links', links || '')
                localStorage.setItem('platforms', platforms || '')
                localStorage.setItem('clientId', clientId || '')
                localStorage.setItem('incentives', incentiveType || '')
                localStorage.setItem('platformName', platformName || '')
                localStorage.setItem('platformDescription', platformDescription || '')
            }
            if (setUser) setUser("user");
            await ensureMetamaskConnection();

        } catch (e) {
            console.error(e);
        }
    };

    const handleLitConnect = async () => {
        if ((localStorage.getItem('tool') as string) !== 'lit') {
            const streamId = localStorage.getItem('streamId')
            const logo = localStorage.getItem('logo')
            const links = localStorage.getItem('links')
            const platforms = localStorage.getItem("platforms")
            const clientId = localStorage.getItem("clientId")
            const incentiveType = localStorage.getItem('incentives')
            const platformName = localStorage.getItem('platformName')
            const platformDescription = localStorage.getItem('platformDescription')

            localStorage.clear()
            localStorage.setItem('streamId', streamId || '')
            localStorage.setItem('logo', logo || '')
            localStorage.setItem('links', links || '')
            localStorage.setItem('platforms', platforms || '')
            localStorage.setItem('clientId', clientId || '')
            localStorage.setItem('incentives', incentiveType || '')
            localStorage.setItem('platformName', platformName || '')
            localStorage.setItem('platformDescription', platformDescription || '')
        }
        handleStepper('login')
    }

    const conditionalRendrer = () => {
        const currentStep = stepHistory[stepHistory.length - 1];
        switch (currentStep) {
            case 'initial':
                return <AuthFlow handleLitConnect={handleLitConnect} handleMetamaskConnect={handleMetamaskConnect} />
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
        const clientId = localStorage.getItem("clientId")
        const tool = localStorage.getItem("tool")
        localStorage.clear();
        localStorage.setItem("smartProfileData", smartprofileData || '')
        localStorage.setItem("tool", tool || '')
        let path = '/'
        if (isRsmPlatform()) {
            path = `/rsm?client_id=${clientId}`;
        } else if (isProfileConnectPlatform()) {
            path = `/profile-connect?client_id=${clientId}`;
        }
        handleStepper("initial")
        navigate(path, { replace: true });
    }




    const handleOk = async () => {
        if (ceramicError) {
            const result: AuthUserInformation | "" | "error" | undefined = await connectOrbisDidPkh();
            if (result === "error") {
                // Handle error case if needed
                console.error("Error connecting to Orbis");
                setCeramicError(true)
            } else if (result && result.did) {
                localStorage.setItem('userDid', JSON.stringify(result?.did))
                setCeramicError(false)
            } else {
                setCeramicError(true)
            }
        } else {
            generateMetamaskToken()
            setError(false)
        }

    }
    const handleCancel = async () => {
        await handleLogout()
        setError(false)
        setCeramicError(false)
    }

    return (
        <>
            <LogoutModal
                isVisible={metmaskLoginError || ceramicError}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />
            <WidgetLayout
                currentStep={currentStep === 'success'}
                showBackButton={isBackButton}
                handleBack={handleBack}
                title={getTitleText(stepHistory)}
                description={getDescription(stepHistory)}
                showHeaderLogo={
                    currentStep !== 'socialConnect' &&
                    currentStep !== 'metaverseHub'
                }
                showBackgroundImage={currentStep === 'socialConfirmation'}
                isLoading={isLoading}
                infoLoading={infoLoading}
                selectedSocial={selectedSocial}
                sumbitDataToOrbis={getLatestSmartProfile}

            >
                {conditionalRendrer()}
            </WidgetLayout >
        </>
    );
};

export default Login;
