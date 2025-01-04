/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react"
import axios from "axios"
import { message } from "antd"
import { useAccount } from "wagmi"

import './styles.css'
import { UserAvatar } from "../Avatar"
import CustomInputField from "../customInputField"
import { useMetamaskPublicKey } from "../../hooks/useMetamaskPublicKey"
import { API_BASE_URL, CLIENT_ID } from "../../utils/EnvConfig"
import { encryptData } from "../../services/EncryptionDecryption/encryption"
import CustomButtom from "../customButton"
import { updateSmartProfile } from "../../services/orbis/updateQuery"
import { getLocalStorageValueofClient, reGenerateUserDidAddress } from "../../utils/Helpers"
import { useStepper } from "../../hooks/useStepper"

const ProfileSettings = () => {
    const { goBack } = useStepper()
    const { getPublicKey } = useMetamaskPublicKey()
    const [loading, setLoading] = useState(false)

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId, litAccount } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { smartProfileData: parsedUserOrbisData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    const name = parsedUserOrbisData?.data?.smartProfile?.username
    const userAvatar = parsedUserOrbisData?.data?.smartProfile?.avatar
    const bio = parsedUserOrbisData?.data?.smartProfile?.bio

    const [username, setUsername] = useState(name || '')
    const [profilePic, setProfilePic] = useState<string>(userAvatar || '')
    const [userBio, setUserBio] = useState(bio || '')

    const litAddress = litAccount ? JSON.parse(litAccount).address : '';
    const { address: metamaskAddress } = useAccount();

    const handleInputChnage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any>) => {
        const maxSize = 45 * 1024 * 1024
        const { name, value, files } = event.target
        if (files && files[0] && files[0].size > maxSize) {
            alert("Maximal size of bio image exceeds 45 MB");
            event.target.value = profilePic;
        }
        if (name === 'username') {
            setUsername(value)
        } else if (name === 'profilePic' && files) {
            const reader = new FileReader();
            reader.onloadend = function () {
                if (typeof reader.result === 'string') {
                    setProfilePic(reader.result);
                }
            };
            reader.readAsDataURL(files[0]);
        } else {
            setUserBio(value)
        }
    }


    const handleDataSumbit = () => {
        // if (
        //     username === userData?.username &&
        //     profilePic === userAvatar &&
        //     userBio === userData?.bio
        // ) {
        //     message.warning("Your data is alreday upto date")
        // } else {
        //     submitData()
        // }
        submitData()
    }
    const submitData = async () => {
        try {
            setLoading(true)
            const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)
            const payLoaddata = {
                username,
                profileImg: profilePic === userAvatar ? "" : profilePic,
                bio: userBio
            }
            const { data } = await axios.put(`${API_BASE_URL}/user/smart-profile`, { data: payLoaddata, smartProfile: parsedUserOrbisData.data.smartProfile }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-profile-type-stream-id': profileTypeStreamId,
                }
            })

            const { success, smartProfile } = data
            if (success) {
                const { signature: litSignature } = getLocalStorageValueofClient(`clientID-${clientId}`)
                let publicKey;
                if (!litSignature) {
                    publicKey = await getPublicKey();
                }
                const privateDataObj = smartProfile.privateData
                const encryptedPrivateData = await encryptData(JSON.stringify(smartProfile.privateData), publicKey)
                smartProfile.privateData=encryptedPrivateData
                await reGenerateUserDidAddress()

                const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                const streamData = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                const updationResult = await updateSmartProfile(smartProfile, streamData.smartProfileData.streamId)

                if (updationResult) {
                    // Deserialize smart profile object
                    smartProfile.scores = JSON.parse(smartProfile.scores)
                    smartProfile.connectedPlatforms = JSON.parse(smartProfile.connectedPlatforms)
                    smartProfile.extendedPublicData = JSON.parse(smartProfile.extendedPublicData)
                    smartProfile.attestation = JSON.parse(smartProfile.attestation)
                    smartProfile.privateData = privateDataObj
                    const objData = {
                        streamId: updationResult?.id,
                        data: { smartProfile: smartProfile }
                    }
                    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                    const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
                    let existingData = existingDataString ? JSON.parse(existingDataString) : {}

                    existingData = {
                        ...existingData,
                        smartProfileData: objData,
                    }

                    localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))
                    message.success("Profile updated successfully!")

                    setLoading(false)
                    goBack()
                }
            }
        } catch (err) {
            console.log("Some Error:", err)
        }
    }

    return (
        <div className="settings-wrapper">
            <CustomInputField
                InputType='text'
                name='username'
                placeholderText="Username"
                value={username}
                handleChange={handleInputChnage}
            />

            <div className="upload-file">
                <div className="profile-img">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" />
                    ) : (
                        <UserAvatar address={litAddress || metamaskAddress} size={100} />
                    )}
                </div>
                <label htmlFor="profilePic" className='neumorphic-label'>Choose file</label>
                <CustomInputField
                    InputType='file'
                    id='profilePic'
                    name="profilePic"
                    handleChange={handleInputChnage}
                />
            </div>



            <CustomInputField
                InputType='textarea'
                name="userBio"
                placeholderText="Enter Your Bio"
                value={userBio}
                handleChange={handleInputChnage}
            />

            <div>
                <CustomButtom
                    text={loading ? 'Updating Profile...' : "Update Profile"}
                    handleClick={handleDataSumbit}
                    isDisable={(!username && !profilePic && !userBio) || loading}
                />
            </div>


        </div>
    )
}

export default ProfileSettings
