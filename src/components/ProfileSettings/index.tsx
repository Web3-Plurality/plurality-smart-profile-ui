/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react"
import axios from "axios"
import { message } from "antd"
import { useAccount } from "wagmi"

import './styles.css'
import { UserAvatar } from "../Avatar"
// import CustomInputField from "../customInputField"
import { API_BASE_URL, CLIENT_ID } from "../../utils/EnvConfig"
import CustomButtom from "../customButton"
import { getLocalStorageValueofClient } from "../../utils/Helpers"
import { useStepper } from "../../hooks/useStepper"
import { updatePublicSmartProfileAction } from "../../utils/SmartProfile"
import { sendUserDataEvent } from "../../utils/sendEventToParent"
import styled from "styled-components"
// import { ProfileSetupData } from "../../types"
// import { useSelector } from "react-redux"
// import { selectProfileSetupData } from "../../selectors/userDataSelector"

const ProfileSetupWrapper = styled.div`
  padding: 30px;
  border-radius: 25px;
  text-align: center;
  font-family: "Lexend", sans-serif;
`;

const SectionContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;

    @media(max-width: 440px) {
        margin-top: 80px;
    }
`;

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const Avatar = styled.img`
  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: 100px;
  box-shadow: 5px 4px 8px rgba(0, 0, 0, 0.25);
  background: #e0e0e0;

  @media (max-width: 400px) {
    width: 100px;
    height: 100px;
  }

`;

const FileInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  margin-top: 10px;
  padding: 6px 12px;
  background: #f9f9f9;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.41), -4px -4px 6px #ffffff;
  border-radius: 30px;
  font-size: 14px;
  color: #4c4c4c;
  cursor: pointer;
  display: inline-block;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #e0e0e0;
    transform: scale(1.05);
  }

  @media (max-width: 400px) {
    font-size: 12px;
  }
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: #f9f9f9;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.41), -4px -4px 6px #ffffff;
  font-size: 14px;
  color: #4c4c4c;
  margin-top: 10px;
  font-family: "Lexend", sans-serif;
  outline: none;

  @media (max-width: 400px) {
    font-size: 12px;
  }
`;

const BioTextArea = styled.textarea`
  height: 100px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: #f9f9f9;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.41), -4px -4px 6px #ffffff;
  font-size: 14px;
  color: #4c4c4c;
  margin-top: 10px;
  resize: none;
  font-family: "Lexend", sans-serif;
  outline: none;

  @media (max-width: 400px) {
    font-size: 12px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const ProfileSettings = () => {
    const { goBack, goToStep } = useStepper()
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

    const isIframe = window.self !== window.top;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any>) => {
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
                    'x-client-app-id': clientId,
                }
            })

            const { success, smartProfile } = data
            if (success) {
                const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                const { smartProfileData: smartprofileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                const consent = smartprofileData?.data?.smartProfile?.extendedPublicData?.[clientId]?.consent;
                await updatePublicSmartProfileAction(profileTypeStreamId, smartProfile)
                message.success("Profile updated successfully!")
                setLoading(false)
                if (isIframe && (consent && consent === 'accepted')) {
                    goToStep('profile')
                    sendUserDataEvent()
                } else {
                    goBack()
                }
            }

        } catch (err) {
            console.log("Some Error:", err)
        }
    }

    return (
        // <div className="settings-wrapper">
        //     <CustomInputField
        //         InputType='text'
        //         name='username'
        //         placeholderText="Username"
        //         value={username}
        //         handleChange={handleInputChnage}
        //     />

        //     <div className="upload-file">
        //         <div className="profile-img">
        //             {profilePic ? (
        //                 <img src={profilePic} alt="Profile" />
        //             ) : (
        //                 <UserAvatar address={litAddress || metamaskAddress} size={100} />
        //             )}
        //         </div>
        //         <label htmlFor="profilePic" className='neumorphic-label'>Choose file</label>
        //         <CustomInputField
        //             InputType='file'
        //             id='profilePic'
        //             name="profilePic"
        //             handleChange={handleInputChnage}
        //         />
        //     </div>



        //     <CustomInputField
        //         InputType='textarea'
        //         name="userBio"
        //         placeholderText="Enter Your Bio"
        //         value={userBio}
        //         handleChange={handleInputChnage}
        //     />

        //     <div>
        //         <CustomButtom
        //             text={loading ? 'Updating Profile...' : "Update Profile"}
        //             handleClick={handleDataSumbit}
        //             isDisable={(!username && !profilePic && !userBio) || loading}
        //         />
        //     </div>


        // </div>

        <ProfileSetupWrapper>
            {/* <div style={{ display: "flex", gap: "20px", marginTop: "50px" }}> */}
            <SectionContentWrapper>
                <AvatarWrapper>
                    {profilePic ? (
                        <Avatar src={profilePic} />
                    ) : (
                        <UserAvatar address={litAddress || metamaskAddress} size={100} />
                    )}
                    <FileInput type="file" id="fileUpload" onChange={handleInputChange} accept="image/*" />
                    <UploadLabel htmlFor="fileUpload">Choose file</UploadLabel>
                </AvatarWrapper>


                <div>
                    <Input name='username' placeholder="Username" value={username} onChange={handleInputChange} />
                    <BioTextArea name='userBio' placeholder="Enter Your Bio" value={userBio} onChange={(e) => setUserBio(e.target.value)} />
                </div>
            </SectionContentWrapper>

            <ButtonGroup>
                <CustomButtom
                    text={loading ? 'Updating Profile...' : "Update Profile"}
                    isDisable={(!username && !profilePic && !userBio) || loading}
                    handleClick={handleDataSumbit}
                />
            </ButtonGroup>
        </ProfileSetupWrapper>
    )
}

export default ProfileSettings
