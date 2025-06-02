import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useMediaQuery } from 'react-responsive';

interface Props {
  data: string | null;
  isLoading: boolean;
}

const ProfileHighlight = ({ data, isLoading }: Props) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Container>
      {!isMobile ? (
        <QuoteBackground src="/quote.png" alt="Quote background" />
      ) : (
        <MobileQuoteContainer>
          <MobileQuoteContent>
            {isLoading ? (
              <StyledSpin indicator={<LoadingOutlined spin />} />
            ) : (
              <QuoteText>{data}</QuoteText>
            )}
          </MobileQuoteContent>
        </MobileQuoteContainer>
      )}
      
      {!isMobile && (
        <DesktopTextContent wordsLength={data ? data.split(' ').length : 0}>
          {isLoading ? (
            <StyledSpin indicator={<LoadingOutlined spin />} />
          ) : (
            <QuoteText>{data}</QuoteText>
          )}
        </DesktopTextContent>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  position: relative;
  max-width: 640px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 16px;
  }

  @media (max-width: 375px) {
    padding: 0;
  }
    
`;

const QuoteBackground = styled.img`
  width: 100%;
  height: auto;
  display: block;
  max-width: 640px;
`;

const MobileQuoteContainer = styled.div`
  min-height: 200px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '"';
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 60px;
    font-family: serif;
    color: rgba(0, 0, 0, 0.1);
    line-height: 0.8;
  }

  &::after {
    content: '"';
    position: absolute;
    bottom: 10px;
    right: 20px;
    font-size: 60px;
    font-family: serif;
    color: rgba(0, 0, 0, 0.1);
    line-height: 0.1;
  }

  @media (max-width: 480px) {
      min-width: 280px
  }

  @media (max-width: 375px) {
      min-width: 250px
  }
`;

const MobileQuoteContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
`;

const DesktopTextContent = styled.div<{wordsLength: number}>`
  position: absolute;
  top: ${({ wordsLength }) => (wordsLength > 45 ? '60%' : '44%')};
  left: 22%;
  transform: translateY(-50%);
  text-align: left;
  width: 70%;
`;

const QuoteText = styled.p`
  color: #000;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
  text-align: center;
  padding: 0 10px;

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }

  @media (max-width: 375px) {
      width: 250px
  }
`;

const StyledSpin = styled(Spin)`
  .anticon {
    font-size: 28px;
    color: #888888;
    
    @media (max-width: 768px) {
      margin: 0 auto;
      display: block;
    }
  }
`;

export default ProfileHighlight;