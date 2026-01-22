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
import { getLocalStorageValueofClient, deserializeSmartProfile } from "../../utils/Helpers"
import { useStepper } from "../../hooks/useStepper"
import { sendUserDataEvent } from "../../utils/sendEventToParent"
import styled from "styled-components"
import { useSelector } from "react-redux"
import { selectIframeToProfile } from "../../selectors/userDataSelector"
import { useLogoutUser } from "../../hooks/useLogoutUser"

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

const UploadLabel = styled.label<{ disabled?: boolean }>`
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

  ${({ disabled }) =>
    disabled &&
    `
      pointer-events: none;
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      background: #f0f0f0;
      box-shadow: none;
  `}
`;

const Input = styled.input<{ disabled?: boolean }>`
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: ${({ disabled }) => (disabled ? '#f0f0f0' : '#f9f9f9')};
  box-shadow: ${({ disabled }) =>
    disabled
      ? 'none'
      : '2px 4px 6px rgba(0, 0, 0, 0.41), -4px -4px 6px #ffffff'};
  font-size: 14px;
  color: ${({ disabled }) => (disabled ? '#a0a0a0' : '#4c4c4c')};
  margin-top: 10px;
  font-family: "Lexend", sans-serif;
  outline: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};

  @media (max-width: 400px) {
    font-size: 12px;
  }
`;

const BioTextArea = styled.textarea<{ disabled?: boolean }>`
  height: 100px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: ${({ disabled }) => (disabled ? '#f0f0f0' : '#f9f9f9')};
  box-shadow: ${({ disabled }) =>
    disabled
      ? 'none'
      : '2px 4px 6px rgba(0, 0, 0, 0.41), -4px -4px 6px #ffffff'};
  font-size: 14px;
  color: ${({ disabled }) => (disabled ? '#a0a0a0' : '#4c4c4c')};
  margin-top: 10px;
  resize: none;
  font-family: "Lexend", sans-serif;
  outline: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};

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
    const handleLogout = useLogoutUser()
    const [loading, setLoading] = useState(false)

    const isEventProfile = useSelector(selectIframeToProfile)

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { smartProfileData: parsedUserOrbisData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    const name = parsedUserOrbisData?.data?.smartProfile?.username
    const userAvatar = parsedUserOrbisData?.data?.smartProfile?.avatar
    const bio = parsedUserOrbisData?.data?.smartProfile?.bio

    const [username, setUsername] = useState(name || '')
    const [profilePic, setProfilePic] = useState<string>(userAvatar || '')
    const [userBio, setUserBio] = useState(bio || '')

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
            const smartProfile = parsedUserOrbisData.data.smartProfile

            const { data } = await axios.put(`${API_BASE_URL}/user/smart-profile`, {
                data: payLoaddata,
                smartProfile: smartProfile
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-profile-type-stream-id': profileTypeStreamId,
                    'x-client-app-id': clientId,
                }
            })

            const { success, smartProfile: returnedSmartProfile } = data
            if (success) {
                const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`)
                const { smartProfileData: smartprofileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
                const consent = smartprofileData?.data?.smartProfile?.extendedPublicData?.[clientId]?.consent;
                const privateDataObj = returnedSmartProfile.privateData
                if (privateDataObj && Object.keys(privateDataObj).length > 0) {
                    await deserializeSmartProfile(returnedSmartProfile, privateDataObj)
                }

                // Save to localStorage (with plain privateData for UI use)
                const objData = {
                    attestationUID: returnedSmartProfile.onchainAttestationUID,
                    data: { smartProfile: returnedSmartProfile }
                }
                const existingDataString = localStorage.getItem(`streamID-${profileTypeStreamId}`)
                let existingData = existingDataString ? JSON.parse(existingDataString) : {}
                existingData = {
                    ...existingData,
                    smartProfileData: objData,
                }
                localStorage.setItem(`streamID-${profileTypeStreamId}`, JSON.stringify(existingData))

                // Store privateData to backend (now stored in Sapphire confidential contract)
                if (privateDataObj && Object.keys(privateDataObj).length > 0) {
                    try {
                        await axios.post(`${API_BASE_URL}/user/smart-profile/store-private-data`, {
                            privateData: privateDataObj
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'x-profile-type-stream-id': profileTypeStreamId,
                                'x-client-app-id': clientId,
                            }
                        })
                        console.log("=== privateData stored to Sapphire ===")
                    } catch (storeError) {
                        console.error("Failed to store privateData:", storeError)
                        // Don't fail the whole operation - attestation already succeeded
                    }
                }

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
        <ProfileSetupWrapper>
            <SectionContentWrapper>
                <AvatarWrapper>
                    {profilePic ? (
                        <Avatar src={profilePic} />
                    ) : (
                        <UserAvatar address={metamaskAddress || ''} size={100} />
                    )}
                    <FileInput type="file" id="fileUpload" name="profilePic" onChange={handleInputChange} accept="image/*" disabled={isEventProfile} />
                    <UploadLabel htmlFor="fileUpload" disabled={isEventProfile}>Choose file</UploadLabel>
                </AvatarWrapper>


                <div>
                    <Input name='username' placeholder="Username" value={username} onChange={handleInputChange} disabled={isEventProfile} />
                    <BioTextArea name='userBio' placeholder="Enter Your Bio" value={userBio} onChange={(e) => setUserBio(e.target.value)} disabled={isEventProfile} />
                </div>
            </SectionContentWrapper>

            <ButtonGroup>
                <CustomButtom
                    text={isEventProfile ? 'Profile Details' : loading ? 'Updating Profile...' : "Update Profile"}
                    isDisable={(!username && !profilePic && !userBio) || loading}
                    handleClick={isEventProfile ? () => goToStep('profile') : () => handleDataSumbit()}
                />
            </ButtonGroup>
        </ProfileSetupWrapper>
    )
}

export default ProfileSettings
