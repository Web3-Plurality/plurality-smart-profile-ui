import { ReactNode } from 'react';
import footerLogo from '../assets/images/footer-logo.png'
import HeaderLogo from '../assets/svgIcons/fw-logo.svg';
import classNames from 'classnames';

interface WidgetLayoutProps {
    children: ReactNode,
    handleBack: () => void,
    showBackButton: boolean
}

const WidgetLayout = ({ children, handleBack, showBackButton }: WidgetLayoutProps) => {
    return (
        <div className="wrapper">
            <div className="widget">
                <div className='widget-content'>
                    <img className="mvfw-logo" src={HeaderLogo} alt='' />
                    {children}
                </div>
                <div
                    onClick={handleBack}
                    className={classNames('back-btn', { hideBtn: !showBackButton })}>
                    Back
                </div>
            </div>
            <div className='footer'>
                <span>Powered By</span>
                <img src={footerLogo} alt='' />
            </div>
        </div >
    );
};

export default WidgetLayout;