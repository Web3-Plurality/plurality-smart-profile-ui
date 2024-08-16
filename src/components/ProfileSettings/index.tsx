/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react"
import CustomInputField from "../CustomInputField"

import './styles.css'
import CustomButtom from "../CustomButton"
import { useAccount } from "wagmi"
import { UserAvatar } from "../Avatar"

const ProfileSettings = () => {
    const [username, setUsername] = useState('')
    const [profilePic, setProfilePic] = useState<string | null>(null)
    const [userBio, setUserBio] = useState('')

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

    const submitData = () => {
        console.log("Data: ", username, userBio, profilePic)
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
                    text="Update Profile"
                    handleClick={submitData}
                    isDisable={!username && !profilePic && !userBio}
                />
            </div>


        </div>
    )
}

export default ProfileSettings
