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

const ProfileSettings = () => {
    const { user: userData, setUser } = useAuth()
    const { handleBack } = useStep();
    const [loading, setLoading] = useState(false)

    const [username, setUsername] = useState(userData?.username || '')
    const [profilePic, setProfilePic] = useState<string>(userData?.profileImg || '')
    const [userBio, setUserBio] = useState(userData?.bio || '')

    const litAccount = localStorage.getItem('lit-wallet-sig')
    const litAddress = litAccount ? JSON.parse(litAccount).address : '';
    const { address: metamaskAddress } = useAccount();

    const handleInputChnage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any>) => {
        const { name, value, files } = event.target
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
            profilePic === userData?.profileImg &&
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
                profileImg: profilePic === userData?.profileImg ? "" : profilePic,
                bio: userBio
            }
            const { data } = await axios.put(`${BASE_URL}/user`, { data: payLoaddata }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const { success, user } = data
            if (success) {
                setLoading(false)
                setUser({
                    id: userData?.id || '',
                    email: userData?.email || null,
                    address: userData?.address || null,
                    subscribe: userData?.subscribe || false,
                    profileImg: user.profileImg || '',
                    username: user.username || '',
                    bio: user.bio || ''
                })
                message.success("Profile updated successfully!")
                handleBack()
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
