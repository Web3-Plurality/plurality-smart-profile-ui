import { ReactNode } from 'react';
import footerLogo from '../assets/images/footer-logo.png'
import HeaderLogo from '../assets/svgIcons/fw-logo.svg';
import classNames from 'classnames';
import WidgetHeader from './WidgetHeader';

interface WidgetLayoutProps {
    children: ReactNode,
    title: string,
    currentStep: boolean,
    description?: string,
    showBackButton: boolean
    showHeaderLogo: boolean,
    handleBack: () => void,
}

const defaultProps = {
    description: ''
};

const WidgetLayout = ({ children, showBackButton, title, currentStep, description, showHeaderLogo, handleBack }: WidgetLayoutProps) => {
    return (
        <div className="wrapper">
            <div className="widget">
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
                    // onClick={handleBack}
                    className='back-btn'
                >
                    Skip for now
                </div>}
            </div>
            <div className='footer'>
                <span>Powered By</span>
                <img src={footerLogo} alt='' />
            </div>
        </div >
    );
};

WidgetLayout.defaultProps = defaultProps;
export default WidgetLayout;