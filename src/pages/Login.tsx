/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux"
import Home from "../components/Home/home"
import WidgetLayout from "../components/Layout/appLayout"
import { checkPreviousLoginMode, isProfileConnectPlatform, isRsmPlatform, showHeader } from "../utils/Helpers"
import { goToStep, resetSteps } from "../Slice/stepperSlice"
import { selectCurrentStep } from "../selectors/stepperSelector"
import LitLogin from "../components/LitLogin/litLogin"
import { useEffect, useRef, useState } from "react"
import OTPVerification from "../components/otpVerification"
import { PayloadDataType, ProfileData } from "../types"
import EmailVerification from "../components/emailVerification"
import Dashboard from "../components/dashboard"
import AuthSuccess from "../components/authSuccess"
import SocialConnect from "../components/socialConnect"
import { socialConnectButtons } from "../utils/Constants"
// import { MessageType } from "antd/es/message/interface"
import { message } from "antd"
import { useRegisterEvent } from "../hooks/useEventListner"
// import useResponsive from "../hooks/useResponsive"
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
// import axiosInstance from "../services/Api"
import axios from "axios"
import { MessageType } from "antd/es/message/interface"


const Login = () => {
    // const [methodId, setMethodId] = useState<string>('')
    const [emailId, setEmailId] = useState<string>('')
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

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentStep = useSelector(selectCurrentStep)

    const { disconnectAsync } = useDisconnect();
    const { connect, connectors } = useConnect();
    const { address: metamaskAddress, isConnected } = useAccount();

    const storedLitAccount = localStorage.getItem('lit-wallet-sig')
    const token = localStorage.getItem('token')


    const parentUrl = window.location.ancestorOrigins.length > 0 ? window.location.ancestorOrigins[0] : window.location.origin
    const isIframe = window.self !== window.top;

    const {
        message: eventMessage,
        app,
        registerEvent,
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
            // setIsLoading(true)
            dispatch(setLoadingState({ loadingState: true, text: 'Loading your profile!' }))
            localStorage.setItem('clientId', clientId)
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
                    // store the streamID, log and links in localstorage
                    localStorage.setItem('profileTypeStreamId', data.data.streamId)
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
                } catch (fetchError) {
                    // message.error('API request failed!');
                    console.error("Fetch error:", fetchError);
                    navigate('/unauthorized')
                } finally {
                    dispatch(setLoadingState({ loadingState: false, text: '' }))
                }

            }
            fetchData()
        } else {
            setSocialButtons(socialConnectButtons);
            localStorage.setItem("platforms", JSON.stringify(socialConnectButtons))
        }
    }, [clientId]);

    useEffect(() => {
        if (isConnected && !token) {
            generateMetamaskToken()
        }
        window.parent.postMessage({ eventName: 'metamaskConnection', data: { isConnected } }, parentUrl);
    }, [isConnected])

    useEffect(() => {
        const profileData = localStorage.getItem('smartProfileData')
        if (profileData) {
            window.parent.postMessage({ eventName: 'smartProfileData', data: { profileData } }, parentUrl);
        }
    }, [])


    useEffect(() => {
        if (metamaskAddress && currentStep === "home") {
            dispatch(goToStep("success"))
        } else if (litAddress || metamaskAddress) {
            dispatch(goToStep(currentStep))
        } else {
            if (showHeader(currentStep)) {
                dispatch(goToStep("home"))
            }
        }
    }, [metamaskAddress, currentStep])





    let litAddress = ''
    if (storedLitAccount) {
        litAddress = JSON.parse(storedLitAccount).address
    }

    const handleLitConnect = () => {
        if (isIframe) {
            if (warningMessageRef.current) {
                warningMessageRef.current();
                warningMessageRef.current = null;
            }
            warningMessageRef.current = message.warning('Coming Soon!');

        } else {
            checkPreviousLoginMode('lit')
            dispatch(goToStep('litLogin'))
        }
    }
    const handleGoogleConnect = () => {
        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2.5

        window.open(
            "https://app.plurality.local/user/auth/google/login",
            "Google Authentication",
            `width=${width},height=${height},left=${left},top=${top}`
        )
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
            const smartProfileData = localStorage.getItem('smartProfileData')
            const platforms = localStorage.getItem('platforms')
            const parsedPlatforms = platforms ? JSON.parse(platforms) : []
            const connectedPlatforms = smartProfileData ? JSON.parse(smartProfileData).data.smartProfile.connectedPlatforms : []
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

        handleSocialConnectClick()
    };

    useEffect(() => {
        if (eventMessage === 'received') {
            const newActiveStates = [...activeStates];
            if (activeIndex !== null) {
                newActiveStates[activeIndex] = !newActiveStates[activeIndex];
            }
            setActiveStates(newActiveStates);
            // dispatch(setLoadingState({ loadingState: false, text: '' }))
        }
    }, [eventMessage, app]);

    useEffect(() => {
        if (finalPayload.session) {
            dispatch(goToStep('verification'));
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
                return <Home handleLitConnect={handleLitConnect} handleMetamaskConnect={handleMetamaskConnect} />
        }
    }

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
        if (smartprofileData) {
            localStorage.setItem("smartProfileData", smartprofileData || '')
        }
        localStorage.setItem("tool", tool || '')
        let path = '/'
        if (isRsmPlatform()) {
            path = `/rsm?client_id=${clientId}`;
        } else if (isProfileConnectPlatform()) {
            path = `/profile-connect?client_id=${clientId}`;
        }
        window.location.reload()
        dispatch(resetSteps())
        navigate(path, { replace: true });
    }


    const handleOk = async () => {
        if (ceramicError) {
            const result: AuthUserInformation | "" | "error" | undefined = await connectOrbisDidPkh();
            if (result === "error") {
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

            <WidgetLayout> {conditionalRendrer()}</WidgetLayout>
        </>
    )
}

export default Login
