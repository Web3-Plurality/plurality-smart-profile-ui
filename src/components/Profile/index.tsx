import styled from 'styled-components';
import CollapsableList from './CollapsableList'
import ProfileHeader from './ProfileHeader'
import CustomButtom from '../customButton';
import { useState } from 'react';

const ProfileWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: -20px;
`;

const Profile = () => {
    const [isOtherDataVisible, setIsOtherDataVisible] = useState(false)

    const handleOtherDataVisibility = () => {
        setIsOtherDataVisible(true)
    }

    return (
        <>
            <ProfileWrapper>
                <ProfileHeader />
                <CollapsableList
                    isOtherDataVisible={isOtherDataVisible}
                    handleOtherDataVisibility={handleOtherDataVisibility}
                />
            </ProfileWrapper>
            {isOtherDataVisible && (
                 <CustomButtom
                 text='View Profile'
                 minWidth='350px'
                 handleClick={() => setIsOtherDataVisible(false)}
             />
            )}
        </>
    )
}

export default Profile
