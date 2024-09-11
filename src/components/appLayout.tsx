import { ReactNode, useEffect, useState } from 'react';
import footerLogo from '../assets/images/footer-logo.png'
import HeaderLogo from '../assets/svgIcons/app-logo.png';
import classNames from 'classnames';
import WidgetHeader from './WidgetHeader';
import { useStep } from '../context/StepContext';
import Loading from './LitComponents/Loading';
import MobileHeader from './Header/mobileHeader';

interface WidgetLayoutProps {
    children: ReactNode,
    title: string,
    socialsFooter: string
    currentStep: boolean,
    showBackgroundImage: boolean,
    description: string,
    showBackButton: boolean
    showHeaderLogo: boolean,
    isLoading: boolean,
    infoLoading: boolean,
    selectedSocial: string,
    handleBack: () => void,
    sumbitDataToOrbis: () => void
}

const WidgetLayout = ({
    children,
    title,
    socialsFooter,
    currentStep,
    showBackgroundImage,
    description,
    showBackButton,
    showHeaderLogo,
    isLoading,
    infoLoading,
    selectedSocial,
    handleBack,
}: WidgetLayoutProps) => {
    const { stepHistory, handleStepper } = useStep();
    const currentStep1 = stepHistory[stepHistory.length - 1]
    const isDigitalWardrobe = currentStep1 === 'digitalWardrobeConnect' || currentStep1 === 'digitalWardrobe';

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767.98);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth <= 767.98);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div className="wrapper">
            <div className={classNames('widget', { widgetbg: showBackgroundImage })}>
                {isLoading ? (
                    <Loading copy={`Connecting Your ${selectedSocial} Account...`} />
                ) : infoLoading ? (
                    <Loading copy={`Getting Your Profile Info...`} />
                )
                    : (
                        <>
                            <div className={classNames('widget-content', { showHeaderLogo: !showHeaderLogo, digitalWardrobeConnect: isDigitalWardrobe })}>
                                {showHeaderLogo && <img className="app-logo" src={HeaderLogo} alt='' />}
                                {isSmallScreen && <MobileHeader isSmallScreen={isSmallScreen} />}
                                <WidgetHeader title={title} description={description} currentStep={currentStep} />
                                {children}
                            </div>
                            <div
                                onClick={handleBack}
                                className={classNames('back-btn', { hideBtn: !showBackButton })}>
                                Back
                            </div>

                            {!showHeaderLogo && <div
                                className='back-btn'
                                id="w-footer"
                                role='button'
                                tabIndex={0}
                                onClick={
                                    currentStep1 === 'metaverseHub' ? () => handleStepper("socialConnect") :
                                        socialsFooter === 'Continue' ? () => handleStepper('socialConfirmation') :
                                            () => handleStepper('socialConfirmation')}
                            >
                                {currentStep1 === 'metaverseHub' ? "Connect more platforms" : socialsFooter}
                            </div>}
                        </>
                    )}

            </div>
            <div className='footer' role='button' tabIndex={0} onClick={() => window.open('https://plurality.network/', '_blank', 'noopener,noreferrer')}>
                <span>Powered By</span>
                <img src={footerLogo} alt='' />
            </div>
        </div >
    );
};

export default WidgetLayout;