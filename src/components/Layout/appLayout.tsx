import { ReactNode } from 'react';

import PoweredByFooter from './poweredByFooter';
import BackButton from './backButton';
import WidgetContent from './widgetContent';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentStep } from '../../selectors/stepperSelector';
import styled from 'styled-components';
import { getBtntext, isBackBtnVisible } from '../../utils/Helpers';
import { selectLoader } from '../../selectors/userDataSelector';
import { goBack } from '../../Slice/stepperSlice';

interface WidgetLayoutWrapperProps {
    isIframe: boolean;
}

const WidgetLayoutWrapper = styled.div<WidgetLayoutWrapperProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    background-color: ${({ isIframe }) => (isIframe ? 'transparent' : '#EFEFEF')};

    .widget {   
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 430px;
        min-height: 550px;
        max-height: 550px;
        background-color: #F9F9F9;
        border-radius: 25px;
        box-shadow: ${({ isIframe }) =>
        isIframe
            ? 'none'
            : '2px 2px 5px rgba(128, 128, 128, 0.2), 4px 4px 10px rgba(128, 128, 128, 0.2), 6px 6px 15px rgba(128, 128, 128, 0.2), -2px -2px 5px rgba(255, 255, 255, 0.8), -2px -2px 10px rgba(255, 255, 255, 0.8), -6px -6px 15px rgba(255, 255, 255, 0.8);'};
        
        @media (max-width: 440px) {
            width: calc(100% - 40px);
            max-width: 430px; 
        }

    }
`;



const WidgetLayout = ({
    children,
}: { children: ReactNode }) => {
    const dispatch = useDispatch()
    const currentStep = useSelector(selectCurrentStep);
    const showLoader = useSelector(selectLoader)

    const text = getBtntext(currentStep)
    const isVisible = isBackBtnVisible(currentStep, showLoader.loadingState)

    const isIframe = window.self !== window.top;

    return (
        <WidgetLayoutWrapper isIframe={isIframe}>
            <div className='widget'>
                <WidgetContent children={children} />
                {isVisible && <BackButton text={text} handleClick={() => dispatch(goBack())} />}
                {isIframe && <PoweredByFooter />}
            </div>
            {!isIframe && <PoweredByFooter />}
        </WidgetLayoutWrapper >
    );
};

export default WidgetLayout;