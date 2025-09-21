import React, { useState } from "react";
import styled from "styled-components";
import { Tag } from "antd";
import CustomButtom from "../../customButton";
import AvatarImage from './../../../assets/images/avatarImage.jpg'
import { getLocalStorageValueofClient, isInIframe } from "../../../utils/Helpers";
import { API_BASE_URL, CLIENT_ID } from "../../../utils/EnvConfig";
import axios from "axios";
import { useStepper } from "../../../hooks/useStepper";
import { useDispatch, useSelector } from "react-redux";
import { selectProfileSetupData, selectSurprised } from "../../../selectors/userDataSelector";
import { setProfileSetupData, setSurprisedData } from "../../../Slice/userDataSlice";
import { ProfileSetupData } from "../../../types";
import { updateSmartProfileAction } from "../../../utils/SmartProfile";
import { useLogoutUser } from "../../../hooks/useLogoutUser";
import { useNavigate } from "react-router-dom";

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
const SurpriseText = styled.p<{ surprised: boolean }>`
  font-size: 14px;
  color: #545454;
  margin-top: 10px;
  cursor:pointer;
  cursor: ${({ surprised }) => (surprised ? 'not-allowed' : 'pointer')};
  opacity: ${({ surprised }) => (surprised ? 0.5 : 1)};
  @media (max-width: 400px) {
  margin-top: 20px;
    font-size: 12px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const ProfileSetup = () => {
  const userData: ProfileSetupData = useSelector(selectProfileSetupData)
  const isSurprised = useSelector(selectSurprised)
  const [image, setImage] = useState<string | null>(userData.parsedImage);
  const [name, setName] = useState(userData.parsedName)
  const [userBio, setUserBio] = useState(userData.parsedBio)
  const [loading, setLoading] = useState(false)

  const { goToStep } = useStepper()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogout= useLogoutUser()

  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('client_id') || CLIENT_ID;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = function () {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);

    }
  };

  const { profileTypeStreamId, token, onboardingQuestions, showRoulette } = getLocalStorageValueofClient(`clientID-${clientId}`)
  const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

  const { avatar, username, bio } = smartProfileData.data.smartProfile

  const getUserData = () => {
    dispatch(setSurprisedData(true))
    setImage(avatar)
    setName(username)
    setUserBio(bio)
  }

  const goToNextRoute = () => {
    if (showRoulette && !onboardingQuestions.length) {
      goToStep("socialConnect")
      return
    } else if (!showRoulette && !onboardingQuestions.length) {
      if(isInIframe()){
        goToStep("consent")
      }else{
        navigate(`/dashboard?client_id=${clientId}`, { replace: true })
      }
    } else {
      goToStep('onboardingForm')
    }
  }

  const submitData = async () => {
    dispatch(setProfileSetupData({ parsedName: name, parsedBio: userBio, parsedImage: image }))
    if ((!name && !username && !userBio) || (avatar === image && username === name && bio === userBio)) {
      goToNextRoute()
      return
    }
    try {
      setLoading(true)
      const payLoaddata = {
        username: name,
        profileImg: image,
        bio: userBio
      }
      // const {id, ...rest}= smartProfileData.data.smartProfile
      
      const { data } = await axios.put(`${API_BASE_URL}/user/smart-profile`,
        {
          data: payLoaddata,
          smartProfile: smartProfileData.data.smartProfile
        }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-profile-type-stream-id': profileTypeStreamId,
          'x-client-app-id': clientId,
        }
      })

      const { success, smartProfile } = data
      if (success) {
        await updateSmartProfileAction(profileTypeStreamId, smartProfile, handleLogout)
        setLoading(false)
        goToNextRoute()
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

      <SurpriseText onClick={getUserData} surprised={isSurprised}>Surprise me!</SurpriseText>

      <ButtonGroup>
        <CustomButtom
          text="Continue"
          minWidth='360px'
          loader={loading}
          isDisable={loading}
          handleClick={submitData}
        />
      </ButtonGroup>
    </ProfileSetupWrapper>
  );
};

export default ProfileSetup;
