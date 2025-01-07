import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, CLIENT_ID, EAS_BLOCKCHAIN_RPC, EAS_CONTRACT_ADDRESS, OWNER_WALLET_ADDRESS } from "../utils/EnvConfig";
import { ProfileData } from "../types";
import { encryptData } from "../services/EncryptionDecryption/encryption";
import { decryptData } from "../services/EncryptionDecryption/decryption";
import { selectProfileType, selectSmartProfiles } from "../services/orbis/selectQueries";
import { insertSmartProfile } from "../services/orbis/insertQueries";
import { useDispatch } from "react-redux";
import { updateHeader } from "../Slice/headerSlice";
import { deserializeSmartProfile, getLocalStorageValueofClient, reGenerateUserDidAddress } from "../utils/Helpers";
import { useStepper } from "./useStepper";
import { normalizeSmartProfile, PluralityAttestation } from "@plurality-network/smart-profile-utils";
import { message } from "antd";

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

    const createAndPublishSmartProfile = async (profileTypeStreamId: string) =>{
        const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)
        const { data } = await axios.post(`${API_BASE_URL}/user/smart-profile`, { smartProfile: {}}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'x-profile-type-stream-id': profileTypeStreamId,
            }
        })
        if (data.success) {
            const { signature: litSignature } = getLocalStorageValueofClient(`clientID-${clientId}`)
            if (!litSignature) {
                console.log('Lit signatures not found')
            }
            const privateDataObj = data.smartProfile.privateData
            const encryptedPrivateData = await encryptData(JSON.stringify(privateDataObj))
            data.smartProfile.privateData=encryptedPrivateData
            await reGenerateUserDidAddress()
            const insertionResult = await insertSmartProfile(data.smartProfile)
            // save smart profile in local storage along with the returned stream id
            if (insertionResult) {
                await deserializeSmartProfile(data.smartProfile, privateDataObj);
                const objData = {
                    streamId: insertionResult?.id,
                    data: { smartProfile: data.smartProfile }
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
                goToStep(step);
            }
        }
    }    

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
                await createAndPublishSmartProfile(profileTypeStreamId)
                
            }
            else {
                // user has a smart profile in orbis
                const { pkpKey } = getLocalStorageValueofClient(`clientID-${clientId}`)
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
                        goToStep(step)
                    } else {
                        // profile got updated as its attestation value doesnt match so we decrypt it
                        const decryptedData = await decryptData(orbisSmartProfile.privateData)
                        if (decryptedData.code === -32603) {
                            goToStep('success')
                            return
                        }

                        await deserializeSmartProfile(orbisSmartProfile, decryptedData);

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
                            goToStep(step)
                        }
                        else{
                            message.info("Could not validate your profile, Let's reset your profile")
                            await createAndPublishSmartProfile(profileTypeStreamId)
                        
                        }
                    }
                } else {
                    const decryptedData = await decryptData(orbisSmartProfile.privateData)
                    if (decryptedData.code === -32603) {
                        goToStep('success')
                        return
                    }
                    orbisSmartProfile.privateData = decryptedData
                    await deserializeSmartProfile(orbisSmartProfile, decryptedData);

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
                        goToStep(step)
                    }
                    else{
                        message.info("Could not validate your profile, Let's reset your profile")
                        await createAndPublishSmartProfile(profileTypeStreamId)
                    }
                }
            }
        }
    }

    return { loading, getSmartProfileFromOrbis }
}

export default useRefreshOrbisData