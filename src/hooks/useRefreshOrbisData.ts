import { useEffect, useState } from "react";
import { CLIENT_ID, EAS_BLOCKCHAIN_RPC, EAS_CONTRACT_ADDRESS, OWNER_WALLET_ADDRESS } from "../utils/EnvConfig";
import { ProfileData } from "../types";
import { decryptData } from "../services/EncryptionDecryption/decryption";
import { selectProfileType, selectSmartProfiles } from "../services/orbis/selectQueries";
import { useDispatch } from "react-redux";
import { updateHeader } from "../Slice/headerSlice";
import { deserializeSmartProfile, getLocalStorageValueofClient, reGenerateUserDidAddress } from "../utils/Helpers";
import { useStepper } from "./useStepper";
import { normalizeSmartProfile, PluralityAttestation, ProfilePrivateData } from "@plurality-network/smart-profile-utils";
import { message } from "antd";
import { createSmartProfileAction, resetSmartProfileAction } from "../utils/SmartProfile";
import { sendProfileConnectedEvent, sendUserConsentEvent, sendUserDataEvent } from "../utils/sendEventToParent";

type Platform = {
    platform: string,
    authentication: boolean
}

const useRefreshOrbisData = (step: string) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)

    const { platforms } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
    const [socialIcons, setSocialIcons] = useState(platforms || [])

    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const { goToStep } = useStepper()

    useEffect(() => {
        if (socialIcons && profileTypeStreamId) {
            const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
            let existingData = existingDataString ? JSON.parse(existingDataString) : {}

            existingData = {
                ...existingData,
                platforms: socialIcons,
            }
            localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
        } else {
            localStorage.removeItem('platforms');
        }
    }, [socialIcons, profileTypeStreamId]);
  
    const getSmartProfileFromOrbis = async (profileTypeStreamId: string, userDid: string) => {
        setLoading(true)
        const selectResult = await selectProfileType(profileTypeStreamId);
        if (!selectResult) {
            throw new Error("Failed to fetch data from selectProfileType()");
        }

        const { rows } = selectResult;
        if (!rows || !rows.length) {
            throw new Error("No rows returned from selectProfileType()");
        }

        const orbisData = JSON.parse(rows?.[0]?.platforms || [])
        if (orbisData) {
            const { platforms } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
            const activePlatforms = platforms?.filter((button: ProfileData) =>
                orbisData.some((platform: Platform) =>
                    platform.platform.toLowerCase().replace(/\s+/g, '') === button?.displayName?.toLowerCase().replace(/\s+/g, '')
                )
            );
            setSocialIcons(activePlatforms)
            await reGenerateUserDidAddress()
            const response = await selectSmartProfiles(profileTypeStreamId, userDid);

            if (!response?.rows?.length) {
                // no profile found in orbis for this user
                const { consent } = getLocalStorageValueofClient(`clientID-${clientId}`)
                await createSmartProfileAction(profileTypeStreamId)
                dispatch(updateHeader())
                setLoading(false)                
                if (consent?.accepted || consent?.rejected) {
                    sendUserConsentEvent()
                    sendProfileConnectedEvent()
                } else {
                    goToStep(step)
                }
                sendUserDataEvent()
            }
            else {
                // user has a smart profile in orbis
                const { profileTypeStreamId, consent, pkpKey } = getLocalStorageValueofClient(`clientID-${clientId}`)
                const { smartProfileData: smartprofileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                const orbisSmartProfile = (({ 
                    username, 
                    avatar, 
                    bio, 
                    scores, 
                    connectedPlatforms, 
                    profileTypeStreamId, 
                    version,
                    extendedPublicData, 
                    attestation,
                    privateData}) => ({ 
                        username, 
                        avatar, 
                        bio, 
                        scores, 
                        connectedPlatforms, 
                        profileTypeStreamId, 
                        version,
                        extendedPublicData, 
                        attestation,
                        privateData 
                    }))(response.rows[0]);
                
                const streamId = response.rows[0].stream_id;
                    
                const pluralityAttestation = new PluralityAttestation({
                    signerAddress: OWNER_WALLET_ADDRESS || '',
                    easContractAddress: EAS_CONTRACT_ADDRESS || '',
                    rpcProvider: EAS_BLOCKCHAIN_RPC || '',
                  });
                if (smartprofileData) {
                    const { data } = smartprofileData
                    if (JSON.stringify(data.smartProfile.attestation) === orbisSmartProfile.attestation) {
                        // same profile is already present in localstorage
                        setLoading(false)
                        
                        // TODO: check this logic check sendProfileConnectedEvent?
                        if (consent?.accepted || consent?.rejected) {
                            sendUserConsentEvent()
                        } else {
                            goToStep(step)
                        }
                        sendUserDataEvent()
                        sendProfileConnectedEvent()
                    } else {
                        // the profile in localstorage and orbis are different so we take the orbis profile
                        let privataDataObj;
                        if(!orbisSmartProfile.privateData) {
                            // the privata data is empty it means we need to initialize the object
                            privataDataObj = new ProfilePrivateData(); 
                        }
                        else {
                            // the privata data is not empty it means we need to decrypt the data
                            const privataDataObj = await decryptData(orbisSmartProfile.privateData)
                            if (privataDataObj.code === -32603) {
                                goToStep('success')
                                return
                            }
                        }
                        await deserializeSmartProfile(orbisSmartProfile, privataDataObj);

                        // verify attestation
                        const smartProfile = normalizeSmartProfile(orbisSmartProfile)
                        const isVerifiedSmartProfileAttestaion = await pluralityAttestation.verifySmartProfileAttestation(
                            smartProfile,
                            pkpKey.ethAddress,
                        );

                        if (isVerifiedSmartProfileAttestaion) {
                            console.log('Attestation Verified')
                            const objData = {
                                streamId: response.rows[0].stream_id,
                                data: { smartProfile: orbisSmartProfile }
                            }
                            const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
                            let existingData = existingDataString ? JSON.parse(existingDataString) : {}
    
                            existingData = {
                                ...existingData,
                                smartProfileData: objData,
                            }
                            localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
                            dispatch(updateHeader())
                            setLoading(false)
                            // TODO: check this logic check sendProfileConnectedEvent?
                            if (consent?.accepted || consent?.rejected) {
                                sendUserConsentEvent()
                            } else {
                                goToStep(step)
                            }
                            sendUserDataEvent()
                            sendProfileConnectedEvent()
                            }
                        else{
                            message.info("Could not validate your profile, Let's reset your profile")
                            await resetSmartProfileAction(profileTypeStreamId, streamId)
                            dispatch(updateHeader())
                            setLoading(false)
                            goToStep(step);
                        }
                    }
                } else {
                    // the profile is not present in localstorage so we take the orbis profile
                    let privataDataObj;
                    if(!orbisSmartProfile.privateData) {
                        // the privata data is empty it means we need to initialize the object
                        privataDataObj = new ProfilePrivateData(); 
                    }
                    else {
                        // the privata data is not empty it means we need to decrypt the data
                        const privataDataObj = await decryptData(orbisSmartProfile.privateData)
                        if (privataDataObj.code === -32603) {
                            goToStep('success')
                            return
                        }
                    }
                    await deserializeSmartProfile(orbisSmartProfile, privataDataObj);

                    // verify attestation
                    const smartProfile = normalizeSmartProfile(orbisSmartProfile)
                    const isVerifiedSmartProfileAttestaion = await pluralityAttestation.verifySmartProfileAttestation(
                        smartProfile,
                        pkpKey.ethAddress,
                    );
                    if (isVerifiedSmartProfileAttestaion) {
                        console.log('Attestation Verified'); 
                        const objData = {
                            streamId: response.rows[0].stream_id,
                            data: { smartProfile: orbisSmartProfile }
                        }
                        const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
                        let existingData = existingDataString ? JSON.parse(existingDataString) : {}
    
                        existingData = {
                            ...existingData,
                            smartProfileData: objData,
                        }
                        localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
                        dispatch(updateHeader())
                        setLoading(false)

                        if (consent?.accepted || consent?.rejected) {
                            sendUserConsentEvent()
                            sendProfileConnectedEvent()
                        } else {
                            goToStep(step)
                        }
                        sendUserDataEvent()
                    }
                    else{
                        message.info("Could not validate your profile, Let's reset your profile")
                        await resetSmartProfileAction(profileTypeStreamId, streamId)
                        dispatch(updateHeader())
                        setLoading(false)
                        goToStep(step);
                    }
                }
            }
        }
    }

    return { loading, getSmartProfileFromOrbis }
}

export default useRefreshOrbisData