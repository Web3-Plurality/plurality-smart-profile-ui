import React from 'react';
import styled from 'styled-components';
import { CLIENT_ID } from '../../utils/EnvConfig';
import { getLocalStorageValueofClient } from '../../utils/Helpers';

interface Score {
    scoreType: string;
    scoreValue: number;
}

const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 60px;
  overflow-y: auto;
`;

const ScoreItem = styled.div`
  padding: 2px 20px;
  /* margin-bottom: 10px; */
  border-radius: 8px;
  background-color: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScoreType = styled.div`
  font-weight: 600;
  color: #555;
  text-transform: capitalize;
`;

const ScoreValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #4caf50;
`;

const Scores: React.FC = () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { profileTypeStreamId } = getLocalStorageValueofClient(`clientID-${clientId}`);
    const {
        smartProfileData: parsedUserOrbisData,
    } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`);

    const scores = parsedUserOrbisData?.data?.smartProfile?.scores;

    return (
        <Container>
            {scores.map((score: Score, index: number) => (
                <ScoreItem key={index}>
                    <ScoreType>
                        {score.scoreType.replace('_', ' ')}
                    </ScoreType>
                    <ScoreValue>
                        {score.scoreValue}
                    </ScoreValue>
                </ScoreItem>
            ))}
        </Container>
    );
};

export default Scores;
