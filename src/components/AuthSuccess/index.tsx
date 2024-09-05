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
            console.log("Rows (first time select ssmart profile): ", response)
            if (!response?.rows?.length) {
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

                    const decryptedData = decryptData(result?.ciphertext, '')
                    console.log("encryption result: ", decryptedData)

                    const insertionResult = await insertSmartProfile(JSON.stringify(result), JSON.stringify(data.smartProfile.scores), '1', JSON.stringify([]))

                    if (result) {
                        const objData = {
                            streamId: insertionResult?.id,
                            data
                        }
                        localStorage.setItem('smartProfileData', JSON.stringify(objData))
                        handleStepper('socialConnect')
                    }

                }
            } else {
                const smartprofileData = localStorage.getItem("smartProfileData")
                if (smartprofileData) {
                    const { streamId } = JSON.parse(smartprofileData)
                    if (streamId === response.rows[0].stream_id) {
                        console.log("see you after this")
                    } else {
                        console.log("see you after this 2")
                    }
                } else {
                    const { ciphertext, dataToEncryptHash } = JSON.parse(response.rows[0].encrypted_profile_data)
                    console.log("Ned to decrypt: ", ciphertext, dataToEncryptHash)
                    const decryptedData = decryptData(ciphertext, dataToEncryptHash)
                    localStorage.setItem('smartProfileData', JSON.stringify(decryptedData))

                }
            }
        }
        //       //     setCipher(result?.ciphertext)
        //     setCipherHash(result?.dataToEncryptHash)
    }

    return (
        <CustomButtom text={`Lets's Go`} handleClick={getSmartProfileFromOrbis} />
    )
}

export default AuthSuccess
