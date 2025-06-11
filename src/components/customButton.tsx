import { Button, Spin } from "antd";
import styled from "styled-components";
import { useStepper } from "../hooks/useStepper";

interface CustomButtomProps {
    text: string;
    theme?: string;
    minWidth?: string;
    isDisable?: boolean;
    consent?: boolean;
    loader?: boolean;
    handleClick?: () => void;
}

interface ButtonWrapperProps {
    minWidth?: string;
    theme?: string;
    consent?: boolean;
    currentStep: string
}

const ButtonWrapper = styled(Button) <ButtonWrapperProps>`
    min-width: ${({ minWidth }) => (minWidth ? minWidth : '392px')};
    height: 20px;
    padding: 23px 0;
    border-radius: 10px;
    border: none;
    background-color: ${({ theme }) => (theme === 'light' ? 'transparent' : '#565656 !important')};
    font-family: 'Lexend', Courier, monospace;
    color: ${({ theme }) => (theme === 'light' ? '#565656' : '#ffffff !important')};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: ${({ consent, currentStep }) => ((consent && currentStep === 'consent') ? '' : '1rem')};
    margin-bottom: ${({ consent }) => (consent ? '-6rem' : '')};

    &:not(:disabled):hover {
        border: none;
        color: ${({ theme }) => (theme === 'light' ? '#565656 !important' : '#ffffff !important')};
        background-color: ${({ theme }) => (theme === 'light' ? 'transparent' : '#000000 !important')};
    }

    @media (max-width: 441px) {
        min-width: ${({ consent, currentStep }) => (consent ? '' : currentStep === 'profileSettings' ? '350px' :'320px')};
    }

    @media (max-width: 376px) {
        min-width: ${({ consent, currentStep }) => (consent ? '' : currentStep === 'profileSettings' ? '280px' : '250px')};
    }

    .ant-spin {
        .ant-spin-dot-item {
            background-color: #808080;
        }
    }
`;

const StyledSpin = styled(Spin)`
    .ant-spin-dot-item {
        background-color: #808080 !important;
    }
`;

const CustomButtom = ({
    text,
    minWidth,
    theme,
    isDisable,
    consent,
    loader = false,
    handleClick,
}: CustomButtomProps) => {
    const { currentStep } = useStepper()
    return (
        <ButtonWrapper
            type="default"
            iconPosition="end"
            disabled={isDisable || false}
            onClick={handleClick}
            minWidth={minWidth}
            theme={theme}
            consent={consent}
            currentStep={currentStep}
        >
            {loader ? <StyledSpin size="small" /> : text}
        </ButtonWrapper>
    );
};

export default CustomButtom;