import { useEffect, useState } from 'react';
import { useMetamaskPublicKey } from '../../hooks/useMetamaskPublicKey';
import CustomButtom from '../CustomButton'
import { BASE_URL, socialConnectButtons } from '../../common/constants';
import { insertSmartProfile, select, selectSmartProfiles } from '../../common/orbis';
import { decryptData, encryptData } from '../../common/utils';
import axios from 'axios';


const AuthSuccess = ({ handleStepper }: { handleStepper: (val: string) => void }) => {
    const widgetHeader = document.getElementById('w-header');
    widgetHeader?.classList.remove('toogleShow')

    const { getPublicKey } = useMetamaskPublicKey()

    const [socialIcons, setSocialIcons] = useState(() => {
        const platforms = localStorage.getItem('platforms');
        return platforms ? JSON.parse(platforms) : null;
    });

    useEffect(() => {
        if (socialIcons) {
            localStorage.setItem('platforms', JSON.stringify(socialIcons));
        } else {
            localStorage.removeItem('platforms');
        }
    }, [socialIcons]);

    const getSmartProfileFromOrbis = async () => {
        // if (socialIcons) return
        const { rows } = await select();
        const orbisData = JSON.parse(rows?.[0]?.platforms)
        if (orbisData) {
            const activePlatforms = socialConnectButtons?.filter(button =>
                orbisData.some(platform =>
                    platform.platform.toLowerCase() === button.displayName.toLowerCase()
                )
            );
            console.log("yesss", JSON.parse(rows?.[0]?.platforms))
            setSocialIcons(activePlatforms)

            //////////////////////////////////////////
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
                    const publicKey = await getPublicKey()
                    const result = await encryptData(JSON.stringify(data), publicKey)
                    console.log("encryption result: ", result)

                    //const decryptedData = decryptData(JSON.stringify(result), '')
                    //console.log("encryption result: ", decryptedData)

                    const insertionResult = await insertSmartProfile(JSON.stringify(result), JSON.stringify(data.smartProfile.scores), '1', JSON.stringify([]))
                    // save smart profile in local storage along with the returned stream id
                    if (insertionResult) {
                        const objData = {
                            streamId: insertionResult?.id,
                            data
                        }
                        localStorage.setItem('smartProfileData', JSON.stringify(objData))
                        handleStepper('socialConnect')
                    }

                }
            } 
            else {
                // user has a smart profile in orbis
                const smartprofileData = localStorage.getItem("smartProfileData")
                if (smartprofileData) {
                    const { streamId } = JSON.parse(smartprofileData)
                    if (streamId === response.rows[0].stream_id) {
                        handleStepper('socialConnect')
                    } else {
                        console.log("Need to decrypt: ", response.rows[0].encrypted_profile_data)
                        const decryptedData = decryptData(response.rows[0].encrypted_profile_data, '')
                        localStorage.setItem('smartProfileData', JSON.stringify(decryptedData))
                        handleStepper('socialConnect')
                    }
                } else {
                    //const { ciphertext, dataToEncryptHash } = JSON.parse(response.rows[0].encrypted_profile_data)
                    console.log("Need to decrypt: ", response.rows[0].encrypted_profile_data)
                    const decryptedData = decryptData(response.rows[0].encrypted_profile_data, '')
                    localStorage.setItem('smartProfileData', JSON.stringify(decryptedData))
                    handleStepper('socialConnect')
                }
            }
        }
    }

    return (
        <CustomButtom text={`Lets's Go`} handleClick={getSmartProfileFromOrbis} />
    )
}

export default AuthSuccess
