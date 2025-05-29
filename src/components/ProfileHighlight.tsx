import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

interface Props {
  data: string | null;
  isLoading: boolean;
}

const ProfileHighlight = ({ data, isLoading }: Props) => {
  return (
    <Container>
      <QuoteBackground src="/quote.png" alt="Quote background" />
      <TextContent wordsLength={data ? data.split(' ').length : 0}>
        {isLoading ? (
          <StyledSpin indicator={<LoadingOutlined spin />} />
        ) : (
          <QuoteText>{data}</QuoteText>
        )}
      </TextContent>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  position: relative;
  max-width: 640px;
`;

const QuoteBackground = styled.img`
  width: 100%;
  height: auto;
  display: block;
  max-width: 640px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const TextContent = styled.div<{wordsLength: number}>`
  position: absolute;
  top: 60%;
  left: 22%;
  transform: translateY(-50%);
  text-align: left;

  @media (max-width: 1024px) {
    position: static;
    transform: none;
    margin-top: 1.5rem;
    text-align: center;
  }

    @media (max-width: 768px) {
    position: absolute;
    top: ${({ wordsLength }) => (wordsLength > 45 ? '40%' : '44%')};
    left: 12%;
  }

  @media (max-width: 430px) {
    position: absolute;
    top: ${({ wordsLength }) => (wordsLength > 45 ? '33%' : '36%')};
    left: 12%;
  }

    @media (max-width: 380px) {
    position: absolute;
    top: ${({ wordsLength }) => (wordsLength > 45 ? '28%' : '30%')};
    left: 12%;
  }
`;


const QuoteText = styled.p`
  color: #000;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 90%;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    font-size: 11.5px;
  }
`;


const StyledSpin = styled(Spin)`
  .anticon {
    font-size: 28px;      /* Spinner size */
    color: #888888;
    margin-left: 200px;

    @media (max-width: 768px) {
       margin-top: 60px;
       margin-left: 250px;
    }
    
    @media (max-width: 475px) {
      margin-top: 40px;
      margin-left: 150px;
    }
    
    @media (max-width: 380px) {
      margin-left: 120px;
    }
  }
  
`;

export default ProfileHighlight;
