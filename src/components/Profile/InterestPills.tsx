import { Flex, Tag } from 'antd';
import React from 'react';
import { CLIENT_ID } from '../../utils/EnvConfig';
import { getLocalStorageValueofClient, getRandomColor } from '../../utils/Helpers';

const Interests: React.FC = () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId }: { profileTypeStreamId: string } = getLocalStorageValueofClient(`clientID-${clientId}`)
    const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)
    const interests = smartProfileData?.data?.smartProfile?.privateData?.attestedCred?.interests
    const interestAvailable = smartProfileData?.data?.smartProfile?.privateData?.attestedCred?.interests?.length > 0

    return (
        <Flex gap="4px 0" wrap style={{
            padding: '15px 10px', maxHeight: '60px',
            overflowY: 'auto'
        }}>
            {!interestAvailable && <span>No Interests</span>}
            {interestAvailable && interests.map((interest: string, index: number) => (
                <Tag
                    key={`${interest}-${index}`}
                    color={getRandomColor(index)}
                    style={{
                        padding: '3px 10px',
                        borderRadius: '13px',
                        margin: '2px 4px'
                    }}
                >
                    {interest}
                </Tag>
            ))}
        </Flex>
    )
}

export default Interests;

