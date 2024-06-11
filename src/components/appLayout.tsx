import { ReactNode } from 'react';
import footerLogo from '../assets/images/footer-logo.png'
import HeaderLogo from '../assets/svgIcons/fw-logo.svg';
import classNames from 'classnames';
import WidgetHeader from './WidgetHeader';

interface WidgetLayoutProps {
    children: ReactNode,
    title: string,
    socialsFooter: string
    currentStep: boolean,
    showBackgroundImage: boolean,
    description: string,
    showBackButton: boolean
    showHeaderLogo: boolean,
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
    handleBack
}: WidgetLayoutProps) => {
    return (
        <div className="wrapper">
            <div className={classNames('widget', { widgetbg: showBackgroundImage })}>
                <div className='widget-content'>
                    {!showHeaderLogo && <h1>Connect Your Platforms</h1>}
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
            </div>
            <div className='footer'>
                <span>Powered By</span>
                <img src={footerLogo} alt='' />
            </div>
        </div >
    );
};

export default WidgetLayout;