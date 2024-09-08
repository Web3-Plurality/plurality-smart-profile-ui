/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react"
import CustomInputField from "../CustomInputField"

import './styles.css'
import CustomButtom from "../CustomButton"
import { useAccount } from "wagmi"
import { UserAvatar } from "../Avatar"
import axios from "axios"
import { BASE_URL } from "../../common/constants"
import { useAuth } from "../../context/AuthContext"
import { message } from "antd"
import { useStep } from "../../context/StepContext"
import { useMetamaskPublicKey } from "../../hooks/useMetamaskPublicKey"
import { encryptData } from "../../common/utils"
import { autoConnect, insertSmartProfile } from "../../common/orbis"

const ProfileSettings = () => {
    const { user: userData, setUser } = useAuth()
    const { getPublicKey } = useMetamaskPublicKey()
    const { handleBack } = useStep();
    const [loading, setLoading] = useState(false)
    const userOrbisData = localStorage.getItem('smartProfileData')
    const parsedUserOrbisData = userOrbisData ? JSON.parse(userOrbisData) : ''

    const name = parsedUserOrbisData?.data?.smartProfile?.username
    const userAvatar = parsedUserOrbisData?.data?.smartProfile?.avatar
    const bio = parsedUserOrbisData?.data?.smartProfile?.bio

    const [username, setUsername] = useState(name || '')
    const [profilePic, setProfilePic] = useState<string>(userAvatar || '')
    const [userBio, setUserBio] = useState(bio || '')

    const litAccount = localStorage.getItem('lit-wallet-sig')
    const litAddress = litAccount ? JSON.parse(litAccount).address : '';
    const { address: metamaskAddress } = useAccount();

    const handleInputChnage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any>) => {
        const maxSize = 45 * 1024 * 1024
        const { name, value, files } = event.target
        if (files[0] && files[0].size > maxSize) {
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
        if (
            username === userData?.username &&
            profilePic === userAvatar &&
            userBio === userData?.bio
        ) {
            message.warning("Your data is alreday upto date")
        } else {
            submitData()
        }
    }
    const submitData = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const payLoaddata = {
                username,
                profileImg: profilePic === userAvatar ? "" : profilePic,
                bio: userBio
            }
            const { data } = await axios.put(`${BASE_URL}/user`, { data: payLoaddata, smartProfile: parsedUserOrbisData.data.smartProfile }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const { success, smartProfile } = data
            if (success) {


                console.log("Data of smart profile: ", smartProfile)
                const litSignature = localStorage.getItem("signature")
                let publicKey;
                if (!litSignature) {
                    publicKey = JSON.parse(localStorage.getItem("publickey") as string)
                    if (!publicKey) {
                        publicKey = await getPublicKey();
                        localStorage.setItem('publicKey', JSON.stringify(publicKey))
                    }
                }
                const result = await encryptData(JSON.stringify(smartProfile), publicKey)
                console.log("encryption result: ", result)
                //const decryptedData = decryptData(JSON.stringify(result), '')
                //console.log("encryption result: ", decryptedData)
                await autoConnect()
                const insertionResult = await insertSmartProfile(JSON.stringify(result), JSON.stringify(smartProfile.scores), '1', JSON.stringify(data.smartProfile.connected_platforms))
                console.log("insertion result: ", insertionResult)
                // save smart profile in local storage along with the returned stream id
                if (insertionResult) {
                    const objData = {
                        streamId: insertionResult?.id,
                        data: { smartProfile: smartProfile }
                    }
                    localStorage.setItem('smartProfileData', JSON.stringify(objData))
                    // setUser({
                    //     id: userData?.id || '',
                    //     email: userData?.email || null,
                    //     address: userData?.address || null,
                    //     subscribe: userData?.subscribe || false,
                    //     profileImg: user.profileImg || '',
                    //     username: user.username || '',
                    //     bio: user.bio || ''
                    // })
                    // message.success("Profile updated successfully!")

                    setLoading(false)

                    handleBack()
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
