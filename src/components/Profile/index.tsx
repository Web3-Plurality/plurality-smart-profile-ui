import styled from 'styled-components';
import CollapsableList from './CollapsableList'
import ProfileHeader from './ProfileHeader'
import CustomButtom from '../customButton';
import { useStepper } from '../../hooks/useStepper';
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

    const { goToStep } = useStepper()
    return (
        <>
            <ProfileWrapper>
                <ProfileHeader />
                <CollapsableList
                    isOtherDataVisible={isOtherDataVisible}
                    handleOtherDataVisibility={handleOtherDataVisibility}
                />
            </ProfileWrapper>
            {isOtherDataVisible ? (
                <CustomButtom
                    text='View Profile'
                    minWidth='100px'
                    theme={'light'}
                    handleClick={() => setIsOtherDataVisible(false)}
                />
            ) : (
                <CustomButtom
                    text='Connect more Platfroms'
                    minWidth='250px'
                    handleClick={() => goToStep('socialConnect')}
                />
            )}
        </>
    )
}

export default Profile
