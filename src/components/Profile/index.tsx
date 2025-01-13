import styled from 'styled-components';
import CollapsableList from './CollapsableList'
import ProfileHeader from './ProfileHeader'

const ProfileWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: -65px;
`;

const Profile = () => {
    return (
        <ProfileWrapper>
            <ProfileHeader />
            <CollapsableList />
        </ProfileWrapper>
    )
}

export default Profile
