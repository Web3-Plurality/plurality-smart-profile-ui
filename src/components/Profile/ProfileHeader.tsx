import BadgeIcon from './../../assets/svgIcons/badge-icon.svg'
import styled from 'styled-components'
import { getLocalStorageValueofClient } from '../../utils/Helpers';
import { Rating } from 'react-simple-star-rating';
import CustomIcon from '../customIcon';
import { CLIENT_ID } from '../../utils/EnvConfig';

const ProfileHeaderWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    span{
        font-family: 'Lexend';
        margin: 3px 0;
    }

    .connectedPlatforms{
        display: flex;
        gap: 0.15rem;
    }
`;

const ProfileHeader = () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId, incentives: incentiveType } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const {
        smartProfileData: parssedUserOrbisData,
    } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

    const name = parssedUserOrbisData?.data?.smartProfile?.username
    const userAvatar = parssedUserOrbisData?.data?.smartProfile.avatar
    const ratingValue = parssedUserOrbisData?.data?.smartProfile?.connectedPlatforms?.length

    const renderRatings = () => {
        return Array.from({ length: ratingValue }, () => <CustomIcon path={BadgeIcon} />);
    }

    return (
        <ProfileHeaderWrapper>
            <div className="profile-avatar">
                <img src={userAvatar} alt='profile-avatar' />
            </div>
            <span>{name}</span>
            {incentiveType && incentiveType === 'POINTS' && (
                <div className='connectedPlatforms'>{renderRatings()}</div>
            )}
            {incentiveType && incentiveType === 'STARS' && (
                <Rating initialValue={ratingValue} iconsCount={3} readonly={true} size={15} />
            )}
        </ProfileHeaderWrapper>
    )
}

export default ProfileHeader
