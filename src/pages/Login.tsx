/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from "react-redux"
import Home from "../components/Home/home"
import WidgetLayout from "../components/Layout/appLayout"
import { checkPreviousLoginMode, getLocalStorageValueofClient, setLocalStorageValue, showHeader } from "../utils/Helpers"
import LitLogin from "../components/LitLogin/litLogin"
import { useEffect, useRef, useState } from "react"
import OTPVerification from "../components/otpVerification"
import { PayloadDataType, ProfileData } from "../types"
import EmailVerification from "../components/emailVerification"
import Dashboard from "../components/dashboard"
import AuthSuccess from "../components/authSuccess"
import SocialConnect from "../components/socialConnect"
import { socialConnectButtons } from "../utils/Constants"
import { message } from "antd"
import { useRegisterEvent } from "../hooks/useEventListner"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { useMetamaskToken } from "../hooks/useMetamaskToken"
import ProfileSettings from "../components/ProfileSettings"
import LogoutModal from "../components/LogoutModal"
import { AuthUserInformation } from "@useorbis/db-sdk"
import { connectOrbisDidPkh } from "../services/orbis/getOrbisDidPkh"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL, CLIENT_ID } from "../utils/EnvConfig"
import { select } from "../services/orbis/selectQueries"
import { setLoadingState } from "../Slice/userDataSlice"
import axios from "axios"
import { MessageType } from "antd/es/message/interface"
import { useLogoutUser } from "../hooks/useLogoutUser"
import { useStepper } from "../hooks/useStepper"


const Login = () => {

    const [finalPayload, setFinalPayload] = useState<PayloadDataType>({
        session: '',
        userId: '',
        method: 'email'
    });
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const warningMessageRef = useRef<MessageType | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [activeStates, setActiveStates] = useState(socialConnectButtons.map(button => button.active));
    const [socialButtons, setSocialButtons] = useState<ProfileData[]>([])

    const { currentStep, goToStep } = useStepper()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogoutUser = useLogoutUser()

    const { disconnectAsync } = useDisconnect();
    const { connect, connectors } = useConnect();
    const { address: metamaskAddress, isConnected } = useAccount();

    const { token, litWalletSig: storedLitAccount, tool } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const litAddress = storedLitAccount ? JSON.parse(storedLitAccount).address : ''

    const parentUrl = window.location.ancestorOrigins.length > 0 ? window.location.ancestorOrigins[0] : window.location.origin
    const isIframe = window.self !== window.top;

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
    } = useMetamaskToken()

    useEffect(() => {
        // We need tp use this clientId to load the logo
        if (clientId) {
            dispatch(setLoadingState({ loadingState: true, text: 'Loading your profile!' }))
            const domain = window.location.ancestorOrigins.length > 0 ? window.location.ancestorOrigins[0] : window.location.origin
            const fetchData = async () => {
                try {
                    const rsmUrl = `${API_BASE_URL}/crm/client?uuid=${clientId}`
                    const { data } = await axios.get(rsmUrl, {
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
                    }

                    localStorage.setItem(`clientID-${clientId}`, JSON.stringify(ClientIdData))
                    //firstly initilize the roulette constant
                    const selectedResult = await select(data.data.streamId)
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
        if (isConnected && !token && tool !== 'lit') {
            generateMetamaskToken()
            const existingData = getLocalStorageValueofClient(`clientID-${clientId}`)
            const updatedData = {
                ...existingData,
                metamaskAddress
            }
            setLocalStorageValue(`clientID-${clientId}`, JSON.stringify(updatedData))

        }
        window.parent.postMessage({ eventName: 'metamaskConnection', data: { isConnected } }, parentUrl);
    }, [isConnected])

    useEffect(() => {
        const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
        const { smartProfileData: profileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
        if (profileData) {
            window.parent.postMessage({ eventName: 'smartProfileData', data: { profileData } }, parentUrl);
        }
    }, [])

    useEffect(() => {
        if (metamaskAddress && currentStep === "home" && tool !== 'lit') {
            goToStep("success")
        } else if (storedLitAccount || metamaskAddress) {
            goToStep(currentStep!)
        } else {
            if (showHeader(currentStep)) {
                goToStep("home")
            }
        }
    }, [metamaskAddress, currentStep, storedLitAccount])



    const handleLitConnect = () => {
        if (isIframe) {
            if (warningMessageRef.current) {
                warningMessageRef.current();
                warningMessageRef.current = null;
            }
            warningMessageRef.current = message.warning('Coming Soon!');

        } else {
            checkPreviousLoginMode('lit')
            goToStep('litLogin')
        }
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
        const needsConnection = !metamaskAddress || !isConnected;

        if (needsConnection) {
            await disconnectAsync();
            const metamaskConnector = connectors[0]; // MetaMask connector
            connect({ connector: metamaskConnector });
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
            } else if (window.location.pathname === '/rsm' || window.location.pathname === '/') {
                const { links: storedUrls } = getLocalStorageValueofClient(`clientID-${clientId}`)
                const parsedUrls = storedUrls ? JSON.parse(storedUrls) : []
                const clickedIcon = socialButtons?.find((x: ProfileData) => x?.id === index);
                const clickedIconDisplayName = clickedIcon?.displayName?.toLowerCase().replace(/\s+/g, '')
                const selectedItem = parsedUrls.find((item: ProfileData) => item?.platformName?.toLowerCase() === clickedIconDisplayName)
                window.open(selectedItem?.url, '_blank');
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
                return <Home handleLitConnect={handleLitConnect} handleMetamaskConnect={handleMetamaskConnect} handleGoogleConnect={handleGoogleConnect} />
            case 'litLogin':
                return <LitLogin setEmailId={setEmailId} />
            case 'otp':
                return <OTPVerification emailId={emailId} handleFinalPayload={handleFinalPayload} />
            case 'verification':
                return <EmailVerification finalPayload={finalPayload} />
            case 'dashboard':
                return <Dashboard currentAccount={litAddress} />
            case 'success':
                return <AuthSuccess />
            case 'socialConnect':
                return <SocialConnect handleIconClick={handleIconClick} activeStates={activeStates} />
            case 'profileSettings':
                return <ProfileSettings />
            default:
                return <Home handleLitConnect={handleLitConnect} handleMetamaskConnect={handleMetamaskConnect} handleGoogleConnect={handleGoogleConnect} />
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
                isVisible={metmaskLoginError || ceramicError}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />

            <WidgetLayout> {conditionalRendrer()}</WidgetLayout>
        </>
    )
}

export default Login
