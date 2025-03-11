import React, { useState } from "react";
import styled from "styled-components";
import { Tag } from "antd";
import CustomButtom from "../../customButton";
import AvatarImage from './../../../assets/images/avatarImage.jpg'
import BackIcon from './../../../assets/svgIcons/back-icon.svg'

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <ProfileSetupWrapper>
      <TimeTag>~ 1 minute</TimeTag>
      <div style={{ display: "flex", gap: "20px",marginTop:"50px" }}>

        <AvatarWrapper>
          <Avatar src={image || AvatarImage}  />
          <FileInput type="file" id="fileUpload" onChange={handleImageChange} accept="image/*" />
          <UploadLabel htmlFor="fileUpload">Choose file</UploadLabel>
        </AvatarWrapper>


        <div>
          <Input placeholder="Your Name" />
          <BioTextArea placeholder="Your witty bio" />
        </div>
      </div>

      <SurpriseText>Surprise me!</SurpriseText>

      <ButtonGroup>
        <BackButton>
            <img src={BackIcon} alt="back-icon profile setup" />
        </BackButton>
        <CustomButtom
                text='Continue'
                minWidth='300px'
                // loader={isRejectLoading}
                // handleClick={rejectUserConsent}
            />
      </ButtonGroup>
    </ProfileSetupWrapper>
  );
};

export default ProfileSetup;
