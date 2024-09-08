import { useEffect, useState } from "react";
import { BASE_URL, socialConnectButtons } from "../common/constants";
import { autoConnect, insertSmartProfile, select, selectSmartProfiles } from "../common/orbis";
import axios from "axios";
import { decryptData, encryptData } from "../common/utils";

const useRefreshOrbisData = (getPublicKey: () => Promise<any>, handleStepper: (val: string) => void, step: string) => {
    const [socialIcons, setSocialIcons] = useState(() => {
        const platforms = localStorage.getItem('platforms');
        return platforms ? JSON.parse(platforms) : null;
    });

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (socialIcons) {
            localStorage.setItem('platforms', JSON.stringify(socialIcons));
        } else {
            localStorage.removeItem('platforms');
        }
    }, [socialIcons]);

    const getSmartProfileFromOrbis = async () => {
        // if (socialIcons) return
        setLoading(true)
        const { rows } = await select();
        const orbisData = JSON.parse(rows?.[0]?.platforms)
        if (orbisData) {
            const activePlatforms = socialConnectButtons?.filter(button =>
                orbisData.some(platform =>
                    platform.platform.toLowerCase().replace(/\s+/g, '') === button.displayName.toLowerCase().replace(/\s+/g, '')
                )
            );
            console.log("yesss", JSON.parse(rows?.[0]?.platforms))
            setSocialIcons(activePlatforms)

            //////////////////////////////////////////
            await autoConnect()
            const response = await selectSmartProfiles();
            console.log("Rows (first time select smart profile): ", response)
            if (!response?.rows?.length) {
                // no profile found in orbis for this user
                const token = localStorage.getItem('token')
                const { data } = await axios.post(`${BASE_URL}/user/smart-profile`, {}, {
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
                    console.log("insertion result: ", insertionResult)
                    // save smart profile in local storage along with the returned stream id
                    if (insertionResult) {
                        const objData = {
                            streamId: insertionResult?.id,
                            data
                        }
                        localStorage.setItem('smartProfileData', JSON.stringify(objData))
                        setLoading(false)
                        handleStepper(step)
                    }
                }
            }
            else {
                // user has a smart profile in orbis
                const smartprofileData = localStorage.getItem("smartProfileData")
                if (smartprofileData) {
                    const { streamId } = JSON.parse(smartprofileData)
                    if (streamId === response.rows[0].stream_id) {
                        setLoading(false)
                        handleStepper(step)
                    } else {
                        console.log("Need to decrypt: ", response.rows[0].encrypted_profile_data)
                        const decryptedData = await decryptData(response.rows[0].encrypted_profile_data, '')
                        const objData = {
                            streamId: response.rows[0].stream_id,
                            data: { smartProfile: decryptedData }
                        }
                        localStorage.setItem('smartProfileData', JSON.stringify(objData))
                        setLoading(false)
                        handleStepper(step)
                    }
                } else {
                    console.log("Need to decrypt: ", response.rows[0].encrypted_profile_data)
                    const decryptedData = await decryptData(response.rows[0].encrypted_profile_data, '')
                    const objData = {
                        streamId: response.rows[0].stream_id,
                        data: { smartProfile: decryptedData }
                    }
                    localStorage.setItem('smartProfileData', JSON.stringify(objData))
                    setLoading(false)
                    handleStepper(step)
                }
            }
        }
    }

    return { loading, getSmartProfileFromOrbis }
}

export default useRefreshOrbisData
