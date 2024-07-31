import { ReactNode } from 'react';
import footerLogo from '../assets/images/footer-logo.png'
import HeaderLogo from '../assets/svgIcons/fw-logo.svg';
import classNames from 'classnames';
import WidgetHeader from './WidgetHeader';
import { useStep } from '../context/StepContext';
import Loading from './LitComponents/Loading';

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
    selectedSocial: string,
    handleBack: () => void,
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
    selectedSocial,
    handleBack
}: WidgetLayoutProps) => {
    const { stepHistory } = useStep();
    const currentStep1 = stepHistory[stepHistory.length - 1]
    const isDigitalWardrobe = currentStep1 === 'digitalWardrobeConnect' || currentStep1 === 'digitalWardrobe';

    return (
        <div className="wrapper">
            <div className={classNames('widget', { widgetbg: showBackgroundImage })}>
                {isLoading ? (
                    <Loading copy={`Connecting Your ${selectedSocial} Account...`} />
                ) : (
                    <>
                        <div className={classNames('widget-content', { showHeaderLogo: !showHeaderLogo, digitalWardrobeConnect: isDigitalWardrobe })}>

                            {showHeaderLogo && <img className="mvfw-logo" src={HeaderLogo} alt='' />}
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
                        >
                            {socialsFooter}
                        </div>}
                    </>
                )}

            </div>
            <div className='footer'>
                <span>Powered By</span>
                <img src={footerLogo} alt='' />
            </div>
        </div >
    );
};

export default WidgetLayout;