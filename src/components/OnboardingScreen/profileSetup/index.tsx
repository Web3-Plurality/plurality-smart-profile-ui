import React, { useState } from "react";
import styled from "styled-components";
import { message, Tag } from "antd";
import CustomButtom from "../../customButton";
import AvatarImage from './../../../assets/images/avatarImage.jpg'
import BackIcon from './../../../assets/svgIcons/back-icon.svg'
import { getLocalStorageValueofClient } from "../../../utils/Helpers";
import { API_BASE_URL, CLIENT_ID } from "../../../utils/EnvConfig";
import { updatePublicSmartProfileAction } from "../../../utils/SmartProfile";
import axios from "axios";
import { useStepper } from "../../../hooks/useStepper";

const ProfileSetupWrapper = styled.div`
  padding: 30px;
  border-radius: 25px;
  text-align: center;
  font-family: "Lexend", sans-serif;
`;

const TimeTag = styled(Tag)`
  background: #e0e0e0;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 14px;
  color: #545454;
  font-weight: bold;
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
`;
const SurpriseText = styled.p`
  font-size: 14px;
  color: #545454;
  margin-top: 10px;
  cursor:pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const BackButton = styled.button`
  width: 50px;
  height: 51px;
  background: #f1f1f1;
  border: 1px solid #545454;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 1rem;
`;

const ProfileSetup = () => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('')
  const [userBio, setUserBio] = useState('')
  const [loading, setLoading] = useState(false)

  const { goToStep, goBack } = useStepper()

  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('client_id') || CLIENT_ID;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const { profileTypeStreamId, token } = getLocalStorageValueofClient(`clientID-${clientId}`)
  const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

  const { avatar, username, bio } = smartProfileData.data.smartProfile

  const getUserData = () => {
    setImage(avatar)
    setName(username)
    setUserBio(bio)
  }

  const submitData = async () => {
    if ((!name && !username && !userBio) || (avatar === image && username === name && bio === userBio)) {
      goToStep('onboardingForm')
      return
    }
    try {
      setLoading(true)
      const payLoaddata = {
        username: name,
        profileImg: avatar,
        bio: userBio
      }
      const { data } = await axios.put(`${API_BASE_URL}/user/smart-profile`, { data: payLoaddata, smartProfile: smartProfileData.data.smartProfile }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-profile-type-stream-id': profileTypeStreamId,
        }
      })



      const { success, smartProfile } = data
      if (success) {
        await updatePublicSmartProfileAction(profileTypeStreamId, smartProfile)
        message.success("Profile updated successfully!")
        setLoading(false)
        goToStep('onboardingForm')
      }

    } catch (err) {
      console.log("Some Error:", err)
    }
  }

  return (
    <ProfileSetupWrapper>
      <TimeTag>~ 1 minute</TimeTag>
      <div style={{ display: "flex", gap: "20px", marginTop: "50px" }}>

        <AvatarWrapper>
          <Avatar src={image || AvatarImage} />
          <FileInput type="file" id="fileUpload" onChange={handleImageChange} accept="image/*" />
          <UploadLabel htmlFor="fileUpload">Choose file</UploadLabel>
        </AvatarWrapper>


        <div>
          <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <BioTextArea placeholder="Your witty bio" value={userBio} onChange={(e) => setUserBio(e.target.value)} />
        </div>
      </div>

      <SurpriseText onClick={getUserData}>Surprise me!</SurpriseText>

      <ButtonGroup>
        <BackButton>
          <img src={BackIcon} onClick={goBack} alt="back-icon profile setup" />
        </BackButton>
        <CustomButtom
          text="Continue"
          minWidth='300px'
          loader={loading}
          isDisable={loading}
          handleClick={submitData}
        />
      </ButtonGroup>
    </ProfileSetupWrapper>
  );
};

export default ProfileSetup;
