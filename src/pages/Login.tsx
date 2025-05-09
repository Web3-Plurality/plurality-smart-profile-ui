/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from "react-redux"
import Home from "../components/Home/home"
import WidgetLayout from "../components/Layout/appLayout"
import {
    checkPreviousLoginMode,
    getLocalStorageValueofClient,
    setLocalStorageValue,
    getParentUrl,
    showHeader,
    isInIframe
} from "../utils/Helpers"
import LitLogin from "../components/LitLogin/litLogin"
import { useEffect, useState } from "react"
import OTPVerification from "../components/otpVerification"
import { PayloadDataType, ProfileData } from "../types"
import EmailVerification from "../components/emailVerification"
import Dashboard from "../components/dashboard"
import AuthSuccess from "../components/authSuccess"
import SocialConnect from "../components/socialConnect"
import { socialConnectButtons, SupportedNetwork } from "../utils/Constants"
import { message } from "antd"
import { useRegisterEvent } from "../hooks/useEventListner"
import { useConnect, useDisconnect } from "wagmi"
import { useMetamaskToken } from "../hooks/useMetamaskToken"
import ProfileSettings from "../components/ProfileSettings"
import LogoutModal from "../components/LogoutModal"
import { AuthUserInformation } from "@useorbis/db-sdk"
import { connectOrbisDidPkh } from "../services/orbis/getOrbisDidPkh"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL, CLIENT_ID } from "../utils/EnvConfig"
import { selectProfileType } from "../services/orbis/selectQueries"
import { setLoadingState } from "../Slice/userDataSlice"
import axios from "axios"
import { useLogoutUser } from "../hooks/useLogoutUser"
import { useStepper } from "../hooks/useStepper"
import Consent from "../components/Consent"
import Profile from "../components/Profile"
import { sendProfileConnectedEvent, sendUserDataEvent } from "../utils/sendEventToParent"
import Transaction from "../components/Transaction"
import Wallet from "../components/Wallet"
import Signing from "../components/Signing"
import Contract from "../components/Contract"
import ProfileSetup from "../components/OnboardingScreen/profileSetup"
import OnboardingForm from "../components/OnboardingScreen/questionaire"

const Login = () => {

    const [finalPayload, setFinalPayload] = useState<PayloadDataType>({
        session: '',
        userId: '',
        method: 'email'
    });
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [activeStates, setActiveStates] = useState(socialConnectButtons.map(button => button.active));
    const [socialButtons, setSocialButtons] = useState<ProfileData[]>([])
    const [pkpWithMetamakError, setPkpWithMetamaskError] = useState(false)
    const [walletAddress, setWalletAddress] = useState('')

    const { currentStep, goToStep, previousStep } = useStepper()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogoutUser = useLogoutUser()

    const { disconnectAsync } = useDisconnect();
    const { connectAsync, connectors } = useConnect();

    const { token, litWalletSig: storedLitAccount, clientId: id, authentication } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const litAddress = storedLitAccount ? JSON.parse(storedLitAccount).address : ''

    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { smartProfileData: profileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
    const numberOfConnectedPlatforms = profileData?.data?.smartProfile?.connectedPlatforms?.length;

    const parentUrl = getParentUrl()
    const isIframe = isInIframe()

    const {
        message: eventMessage,
        app,
        emailId,
        registerEvent,
        setEmailId
    } = useRegisterEvent()
    const {
        generateMetamaskToken,
        error: metmaskLoginError,
        setError,
        ceramicError,
        setCeramicError
    } = useMetamaskToken(walletAddress)

    useEffect(() => {
        // We need tp use this clientId to load the logo
        if (clientId) {
            dispatch(setLoadingState({ loadingState: true, text: 'Loading your profile!' }))
            const domain = window.location.ancestorOrigins.length > 0 ? window.location.ancestorOrigins[0] : window.location.origin
            const fetchData = async () => {
                try {
                    const apiUrl = `${API_BASE_URL}/crm/client-app/${clientId}`
                    const { data } = await axios.get(apiUrl, {
                        headers: {
                            'x-domain': domain
                        }
                    })

                    if (!data.data) return
                    if (data.error) {
                        message.error(data.error)
                        return
                    }

                    const existingData = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const ClientIdData = {
                        ...existingData,
                        profileTypeStreamId: data.data.streamId,
                        clientId,
                        logo: data.data.logo,
                        links: data.data.links,
                        incentives: data.data.incentiveType,
                        walletData: SupportedNetwork,
                        onboardingQuestions: data.data.onboardingConfig.questions,
                        customOnboarding: data.data.onboardingConfig.customOnboarding,
                        showRoulette: data.data.showRoulette,
                        authentication: data.data.authentication,
                    }

                    localStorage.setItem(`clientID-${clientId}`, JSON.stringify(ClientIdData))
                    //firstly initilize the roulette constant
                    const selectedResult = await selectProfileType(data.data.streamId)
                    if (selectedResult?.neededPlatforms) {
                        setSocialButtons(selectedResult?.neededPlatforms);
                    }

                    const existingDataStreamId = getLocalStorageValueofClient(`streamID-${data.data.streamId}`)
                    const ProfileTypeStreamData = {
                        ...existingDataStreamId,
                        clientId,
                        platforms: selectedResult?.neededPlatforms,
                        platformName: selectedResult?.rows[0].profile_name,
                        platformDescription: selectedResult?.rows[0].description

                    }

                    localStorage.setItem(`streamID-${data.data.streamId}`, JSON.stringify(ProfileTypeStreamData))
                } catch (fetchError) {
                    console.error("Fetch error:", fetchError);
                    navigate('/unauthorized')
                } finally {
                    dispatch(setLoadingState({ loadingState: false, text: '' }))
                }

            }
            fetchData()
        }
    }, [clientId]);

    useEffect(() => {
        if (walletAddress && clientId === id) {
            generateMetamaskToken()
            const existingData = getLocalStorageValueofClient(`clientID-${clientId}`)
            const updatedData = {
                ...existingData,
                metamaskAddress: walletAddress
            }
            setLocalStorageValue(`clientID-${clientId}`, JSON.stringify(updatedData))

        }
    }, [walletAddress])

    useEffect(() => {
        if (clientId === id) {
            if (storedLitAccount || walletAddress) {
                goToStep(currentStep!)
            } else {
                if (showHeader(currentStep)) {
                    goToStep("home")
                }
            }
        }

    }, [walletAddress, currentStep, storedLitAccount, previousStep])


    useEffect(() => {
        const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
        const { smartProfileData: profileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
        const consent = profileData?.data?.smartProfile?.extendedPublicData?.[clientId]?.consent;
        if (profileData) {
            window.parent.postMessage({ eventName: 'smartProfileData', data: { profileData } }, parentUrl);
        }

        if(isIframe && !consent && token) {
            goToStep('consent')
            window.parent.postMessage({ eventName: 'unifiedLogin', data: 'unifiedLogin' }, parentUrl);
        }
        if (consent && (consent == 'accepted' || consent == 'rejected')) {
            sendUserDataEvent()
            sendProfileConnectedEvent()
        }
    }, [])


    const handlePkpWithMetamaskError = (val: boolean) => {
        setPkpWithMetamaskError(val)
    }

    const handleLitConnect = () => {
        checkPreviousLoginMode('lit')
        goToStep('litLogin')
    }
    const handleGoogleConnect = () => {
        registerEvent('')

    }
    const handleMetaMaskNotInstalled = () => {
        alert("MetaMask is not installed");
        const params = new URLSearchParams(window.location.search);
        const origin = params.get('origin')!;
        window.parent.postMessage({ eventName: 'errorMessage', data: "Please install MetaMask" }, origin);
    };

    const ensureMetamaskConnection = async () => {
        const isMetaMaskInstalled = typeof window.ethereum !== 'undefined';
        if (!isMetaMaskInstalled) {
            handleMetaMaskNotInstalled();
            return;
        }
        const needsConnection = !walletAddress;

        if (needsConnection) {
            await disconnectAsync();
            const metamaskConnector = connectors[0];
            const connection = await connectAsync({ connector: metamaskConnector });

            if (connection && connection.accounts.length > 0) {
                setWalletAddress(connection.accounts[0]);
            }
        }
    };

    const handleMetamaskConnect = async () => {
        try {
            checkPreviousLoginMode('metamask')
            await ensureMetamaskConnection();
        } catch (error) {
            console.error(error);
        }
    };



    const handleFinalPayload = (data: PayloadDataType) => {
        setFinalPayload(data)
    }

    const handleIconClick = (index: number) => {
        const handleSocialConnectClick = () => {
            const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
            const { smartProfileData, platforms } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
            const parsedPlatforms = platforms || []
            const connectedPlatforms = smartProfileData?.data?.smartProfile?.connectedPlatforms || []
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
            } else {
                const { links: storedUrls } = getLocalStorageValueofClient(`clientID-${clientId}`)
                const parsedUrls = storedUrls ? JSON.parse(storedUrls) : []
                const clickedIcon = socialButtons?.find((x: ProfileData) => x?.id === index);
                const clickedIconDisplayName = clickedIcon?.displayName?.toLowerCase().replace(/\s+/g, '')
                const selectedItem = parsedUrls.find((item: ProfileData) => item?.platformName?.toLowerCase() === clickedIconDisplayName)
                if(selectedItem.url){
                    window.open(selectedItem.url, '_blank');
                }
            }
        };

        handleSocialConnectClick()
    };

    useEffect(() => {
        if (eventMessage === 'received') {
            const newActiveStates = [...activeStates];
            if (activeIndex !== null) {
                newActiveStates[activeIndex] = !newActiveStates[activeIndex];
            }
            setActiveStates(newActiveStates);
        }
    }, [eventMessage, app]);

    useEffect(() => {
        if (finalPayload.session) {
            goToStep('verification')
        }
    }, [finalPayload.session])

    const conditionalRendrer = () => {
        switch (currentStep) {
            case 'home':
                return <Home 
                    handleLitConnect={handleLitConnect} 
                    handleMetamaskConnect={handleMetamaskConnect} 
                    handleGoogleConnect={handleGoogleConnect}
                    authentication={authentication}
                    />
            case 'litLogin':
                return <LitLogin setEmailId={setEmailId} />
            case 'otp':
                return <OTPVerification emailId={emailId} handleFinalPayload={handleFinalPayload} />
            case 'verification':
                return <EmailVerification
                    finalPayload={finalPayload}
                    pkpWithMetamakError={pkpWithMetamakError}
                    walletAddress={walletAddress}
                    handlePkpWithMetamaskError={handlePkpWithMetamaskError} />
            case 'dashboard':
                return <Dashboard currentAccount={litAddress} />
            case 'success':
                return <AuthSuccess />
            case 'socialConnect':
                return <SocialConnect handleIconClick={handleIconClick} activeStates={activeStates} />
            case 'profileSettings':
                return <ProfileSettings />
            case 'consent':
                return <Consent />
            case 'profile':
                return <Profile />
            case 'transaction':
                return <Transaction />
            case 'wallet':
                return <Wallet />
            case 'signing':
                return <Signing />
            case 'contract':
                return <Contract />
            case 'profileSetup':
                    return <ProfileSetup/>
            case 'onboardingForm':
                return <OnboardingForm />
            default:
                return <Home 
                    handleLitConnect={handleLitConnect} 
                    handleMetamaskConnect={handleMetamaskConnect} 
                    handleGoogleConnect={handleGoogleConnect}
                    authentication={authentication}
                    />
        }
    }

    const handleOk = async () => {
        if (ceramicError) {
            const result: AuthUserInformation | "" | "error" | undefined = await connectOrbisDidPkh();
            if (result === "error") {
                console.error("Error connecting to Orbis");
                setCeramicError(true)
            } else if (result && result.did) {
                const existingDataString = localStorage.getItem(`clientID-${clientId}`)
                let existingData = existingDataString ? JSON.parse(existingDataString) : {}

                existingData = {
                    ...existingData,
                    userDid: result?.did
                }
                localStorage.setItem(`clientID-${clientId}`, JSON.stringify(existingData))
                setCeramicError(false)
            } else {
                setCeramicError(true)
            }
        } else if (pkpWithMetamakError) {
            setPkpWithMetamaskError(false)
            goToStep('verification')
        } else {
            generateMetamaskToken()
            setError(false)
        }
    }

    const handleCancel = async () => {
        await handleLogoutUser()
        setError(false)
        setCeramicError(false)
    }

    return (
        <>
            <LogoutModal
                isVisible={metmaskLoginError || ceramicError || pkpWithMetamakError}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />

            <WidgetLayout connectedPlatforms={numberOfConnectedPlatforms}> {conditionalRendrer()}</WidgetLayout>
        </>
    )
}

export default Login
