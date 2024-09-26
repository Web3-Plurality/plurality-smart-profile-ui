import { useEffect, useState } from "react";
import { BASE_URL } from "../common/constants";
import { autoConnect, insertSmartProfile, select, selectSmartProfiles } from "../common/orbis";
import axios from "axios";
import { decryptData, encryptData } from "../common/utils";

type Platform = {
    platform: string,
    authentication: boolean
}

const useRefreshOrbisData = (getPublicKey: () => Promise<string | undefined>, handleStepper: (val: string) => void, step: string) => {
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

    const getSmartProfileFromOrbis = async (stream_id: string) => {
        if (loading) return
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
            const activePlatforms = JSON.parse(localStorage.getItem("platforms")!)?.filter(button =>
                orbisData.some((platform: Platform) =>
                    platform.platform.toLowerCase().replace(/\s+/g, '') === button.displayName.toLowerCase().replace(/\s+/g, '')
                )
            );
            setSocialIcons(activePlatforms)

            //////////////////////////////////////////
            await autoConnect()
            const response = await selectSmartProfiles(stream_id);

            if (!response?.rows?.length) {
                // no profile found in orbis for this user
                const token = localStorage.getItem('token')
                const { data } = await axios.post(`${BASE_URL}/user/smart-profile`, {}, {
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
                    const insertionResult = await insertSmartProfile(JSON.stringify(result), JSON.stringify(data.smartProfile.scores), '1', JSON.stringify(data.smartProfile.connected_platforms), stream_id)
                    // save smart profile in local storage along with the returned stream id
                    if (insertionResult) {
                        const objData = {
                            streamId: insertionResult?.id,
                            data: { smartProfile: data.smartProfile }
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
                        const decryptedData = await decryptData(response.rows[0].encrypted_profile_data)
                        if (decryptedData.code === -32603) {
                            handleStepper('success')
                            return
                        }
                        const objData = {
                            streamId: response.rows[0].stream_id,
                            data: { smartProfile: decryptedData }
                        }
                        localStorage.setItem('smartProfileData', JSON.stringify(objData))
                        setLoading(false)
                        handleStepper(step)
                    }
                } else {
                    const decryptedData = await decryptData(response.rows[0].encrypted_profile_data)
                    if (decryptedData.code === -32603) {
                        handleStepper('success')
                        return
                    }
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
