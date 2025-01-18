import styled from 'styled-components';
import CollapsableList from './CollapsableList'
import ProfileHeader from './ProfileHeader'
import CustomButtom from '../customButton';
import { useStepper } from '../../hooks/useStepper';

const ProfileWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: -20px;
`;

const Profile = () => {
    const { goToStep } = useStepper()
    return (
        <>
            <ProfileWrapper>
                <ProfileHeader />
                <CollapsableList />
            </ProfileWrapper>
            <CustomButtom
                text='Connect more Platfroms'
                minWidth='250px'
                handleClick={() => goToStep('socialConnect')}
            />
        </>
    )
}

export default Profile
