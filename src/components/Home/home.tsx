import SocialButton from './socialButton';
import metamaskIcon from './../../assets/svgIcons/metamask-icon.svg';

interface HomeProps {
  handleMetamaskConnect: () => void;
  // Keep these for backwards compatibility but they won't be used
  handleLitConnect?: () => void;
  handleGoogleConnect?: () => void;
  authentication?: {
    email: boolean;
    gmail: boolean;
    wallet: boolean;
  };
}

const Home = ({ handleMetamaskConnect }: HomeProps) => {
  return (
    <>
      {/* Only MetaMask authentication is supported */}
      <SocialButton
        text={'Continue with Metamask'}
        icon={metamaskIcon}
        handleClick={handleMetamaskConnect}
      />
    </>
  );
};

export default Home;
