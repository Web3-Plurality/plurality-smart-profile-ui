import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, CLIENT_ID } from "../utils/EnvConfig";
import { ProfileData } from "../types";
import { encryptData } from "../services/EncryptionDecryption/encryption";
import { decryptData } from "../services/EncryptionDecryption/decryption";
import { select, selectSmartProfiles } from "../services/orbis/selectQueries";
import { insertSmartProfile } from "../services/orbis/insertQueries";
import { useDispatch } from "react-redux";
import { updateHeader } from "../Slice/headerSlice";
import { getLocalStorageValueofClient, reGenerateUserDidAddress } from "../utils/Helpers";
import { useStepper } from "./useStepper";
import { normalizeSmartProfile, PluralityAttestation } from "@plurality-network/smart-profile-utils";

type Platform = {
    platform: string,
    authentication: boolean
}

const useRefreshOrbisData = (getPublicKey: () => Promise<string | undefined>, step: string) => {
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

    const getSmartProfileFromOrbis = async (stream_id: string, userDid: string) => {
        setLoading(true)
        const selectResult = await select(stream_id);
        if (!selectResult) {
            throw new Error("Failed to fetch data from select()");
        }

        const { rows } = selectResult;
        if (!rows || !rows.length) {
            throw new Error("No rows returned from select()");
        }

        const orbisData = JSON.parse(rows?.[0]?.platforms || [])
        if (orbisData) {
            const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
            const { platforms } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
            const activePlatforms = platforms?.filter((button: ProfileData) =>
                orbisData.some((platform: Platform) =>
                    platform.platform.toLowerCase().replace(/\s+/g, '') === button?.displayName?.toLowerCase().replace(/\s+/g, '')
                )
            );
            setSocialIcons(activePlatforms)
            await reGenerateUserDidAddress()
            const response = await selectSmartProfiles(stream_id, userDid);

            if (!response?.rows?.length) {
                // no profile found in orbis for this user

                const { profileTypeStreamId, token } = getLocalStorageValueofClient(`clientID-${clientId}`)

                const { data } = await axios.post(`${API_BASE_URL}/user/smart-profile`, { smartProfile: {}}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'x-profile-type-stream-id': profileTypeStreamId,
                    }
                })

                if (data.success) {
                    const { signature: litSignature } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    let publicKey;
                    if (!litSignature) {
                        publicKey = await getPublicKey();
                    }
                    const result = await encryptData(JSON.stringify(data.smartProfile), publicKey)
                    await reGenerateUserDidAddress()
                    const insertionResult = await insertSmartProfile(JSON.stringify(result), JSON.stringify(data.smartProfile.scores), '1', JSON.stringify(data.smartProfile.connectedPlatforms), stream_id)
                    // save smart profile in local storage along with the returned stream id
                    if (insertionResult) {
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
            else {
                // user has a smart profile in orbis
                const { profileTypeStreamId, pkpKey } = getLocalStorageValueofClient(`clientID-${clientId}`)
                const { smartProfileData: smartprofileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                const pluralityAttestation = new PluralityAttestation({
                    signerAddress:import.meta.env.VITE_APP_OWNER_WALLET_ADDRESS || '',
                    easContractAddress: import.meta.env.VITE_APP_EAS_CONTRACT_ADDRESS || '',
                    rpcProvider: import.meta.env.VITE_APP_EAS_BLOCKCHAIN_RPC || '',
                  });
                if (smartprofileData) {
                    const { streamId } = smartprofileData
                    //TODO: Update this check as now we are creating new commits on exisiting streams instead of adding a new one everytime
                    // Lets discuss it how we can do that in orbis 
                    if (streamId === response.rows[0].stream_id) {
                        setLoading(false)
                        goToStep(step)
                    } else {
                        const decryptedData = await decryptData(response.rows[0].encrypted_profile_data)
                        if (decryptedData.code === -32603) {
                            goToStep('success')
                            return
                        }
                        // verify attestation
                          //TODO: I think we can wrap this logic into a functions into verifySmartProfileAttestation and use that instead
                          // update the imported package to create verifySmartProfileAttestation and use it here
                            const smartProfile = normalizeSmartProfile(decryptedData)
                          const isVerifiedSmartProfileAttestaion = await pluralityAttestation.verifySmartProfileAttestation(
                            smartProfile,
                            pkpKey.ethAddress,
                        );


                        if (isVerifiedSmartProfileAttestaion) {
                            console.log('Attestation Checked'); 
                        }
                        else{
                            // TODOS:
                            // We need to handle if we hit this block
                            // 1. show a popup on UI that exisitng profile can not be verified so we would initiate the profile creation again
                            // 2. we would call POST /smart-profile with {} to get a fresh profile with old name and bio etc (from smart profile map) but no other data
                            // 3. update the resetted profile at same stream id
                            console.log("Need to re-create profile after this because old one is not valid")
                        }
                        const objData = {
                            streamId: response.rows[0].stream_id,
                            data: { smartProfile: decryptedData }
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
                } else {
                    const decryptedData = await decryptData(response.rows[0].encrypted_profile_data)
                    if (decryptedData.code === -32603) {
                        goToStep('success')
                        return
                    }
                    // TODO: same comments as above apply here
                    // verify attestation
                    const smartProfile = normalizeSmartProfile(decryptedData)
                    const isVerifiedSmartProfileAttestaion = await pluralityAttestation.verifySmartProfileAttestation(
                        smartProfile,
                        pkpKey.ethAddress,
                    );
                    if (isVerifiedSmartProfileAttestaion) {
                        console.log('Attestation Checked'); 
                    }
                    else{
                        console.log("Need to re-create profile after this because old one is not valid")
                    }

                    const objData = {
                        streamId: response.rows[0].stream_id,
                        data: { smartProfile: decryptedData }
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
            }
        }
    }

    return { loading, getSmartProfileFromOrbis }
}

export default useRefreshOrbisData
