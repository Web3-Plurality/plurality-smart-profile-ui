import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CLIENT_ID } from '../utils/EnvConfig';

const StepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StepMarker = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
`;

const StepCircle = styled.div`
  background-color: #00CEBA;
  color: black;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const VerticalConnector = styled.div`
  position: absolute;
  left: 17px; /* Half of circle width */
  top: 32px; /* Start below the circle */
  height: calc(100% + 5rem); /* Connects to next circle */
  width: 0.1px;
  background: #c1cbcb;
  z-index: 1;
`;

const StepText = styled.p`
  margin: 0;
  padding-top: 4px;
  font-size: 20px;
  line-height: 1.5;
  color: black;
  white-space: normal;
  max-width: 550px;

  @media (max-width: 1024px) {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;


const LinkText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
`;

const ComingSoon = styled.span`
  color: #666;
  font-style: italic;
`;

const StepList = ({ data}:{data: string | null}) => {
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('client_id') || CLIENT_ID;

  const handleShare = () => {
    // Get the current URL
    //const heading = encodeURIComponent('Here is what @PluralityWeb3 thinks about me 👇');

    // Create the tweet text with hashtags
    const text = encodeURIComponent(`Here is what @PluralityWeb3 thinks about me 👇\n${data}`);

    // Open Twitter with pre-filled tweet
    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      '_blank',
      'noopener,noreferrer'
    );
  };



  return (
    <div className='step-list'>
      <p>Earn more points by</p>
      <StepsWrapper>
        <StepItem>
          <StepMarker>
            <StepCircle>1</StepCircle>
            <VerticalConnector />
          </StepMarker>
          <StepText>
            <LinkText onClick={() => navigate(`/?client_id=${clientId}`)}>Connecting</LinkText> more platforms in your profile
          </StepText>
        </StepItem>

        <StepItem>
          <StepMarker>
            <StepCircle>2</StepCircle>
            <VerticalConnector />
          </StepMarker>
          <StepText>
            Share what your profile thinks the <LinkText onClick={handleShare}>best thing about you</LinkText>
          </StepText>
        </StepItem>

        <StepItem>
          <StepMarker>
            <StepCircle>3</StepCircle>
            {/* No connector for last item */}
          </StepMarker>
          <StepText>
            Try out apps that match your taste <ComingSoon>(Coming Soon)</ComingSoon>
          </StepText>
        </StepItem>
      </StepsWrapper>
    </div>
  )
};

export default StepList;