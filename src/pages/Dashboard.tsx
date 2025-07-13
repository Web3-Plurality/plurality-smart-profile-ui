import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { message } from 'antd';
import StepList from '../components/stepList';
import ProfileHighlight from '../components/ProfileHighlight';
import ConfettiExplosion from 'react-confetti-explosion';
import axios from 'axios';
import { getLocalStorageValueofClient } from '../utils/Helpers';
import { CLIENT_ID } from '../utils/EnvConfig';
import { useLogoutUser } from './../hooks/useLogoutUser';

const AntMessageStyle = createGlobalStyle`
  .ant-message-notice {
    animation: fadeInUp 0.5s ease forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-image: url('/dashboard-bg.png?height=1080&width=1920');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Content = styled.div`

  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 3rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 4rem
  }
`;

const ConfettiWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

const Dashboard = () => {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleLogoutUser = useLogoutUser();

  const confettiDuration = 4000;

  useEffect(() => {
    const fetchHighlights = async () => {
      const queryParams = new URLSearchParams(location.search);
      const clientId = queryParams.get('client_id') || CLIENT_ID;

      const { profileTypeStreamId, token } = getLocalStorageValueofClient(`clientID-${clientId}`);
      const { smartProfileData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`);
      const url = import.meta.env.VITE_APP_API_BASE_URL!;
      const payload = smartProfileData?.data?.smartProfile;

      try {
        setIsLoading(true);
        const response = await axios.post(
          `${url}/user/analyse`, 
          { smartProfile: payload },
          { headers :{
              Authorization: `Bearer ${token}`,
          } } 
        );

        if (response.status === 200) {
          setData(response.data.paragraph);
          setShowConfetti(true);

          message.success({
            content: '🎉 Congratulations!',
            duration: 3,
          });

          setTimeout(() => {
            setShowConfetti(false);
          }, confettiDuration);
        }
      } catch (error) {
        console.error('Error fetching profile highlight:', error);
        message.error('Failed to generate profile highlight.');
        handleLogoutUser()
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlights();
  }, []);
  

  return (
    <>
      <AntMessageStyle />
      <Wrapper>
        {showConfetti && (
          <ConfettiWrapper>
            <ConfettiExplosion
              duration={confettiDuration}
              width={1300}
              particleCount={300}
            />
          </ConfettiWrapper>
        )}
        <Content>
          <StepList data={data}/>
          <ProfileHighlight data={data} isLoading={isLoading} />
        </Content>
      </Wrapper>
    </>
  );
};

export default Dashboard;
