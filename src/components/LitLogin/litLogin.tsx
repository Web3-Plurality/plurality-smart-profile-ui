import { useState } from "react";
import CustomButtom from "./../customButton";
import Terms from "./termsOfService";
import useStychLogin from "../../hooks/useStychLogin";
import CustomInputField from "../customInputField";
import styled from "styled-components";

interface LitLoginProps {
    setEmailId: (id: string) => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const LitLoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`


const LitLogin = ({ setEmailId }: LitLoginProps) => {
    const [email, setEmail] = useState('');
    const [acceptance, setAcceptance] = useState(true);
    const {
        sendPasscode,
    } = useStychLogin(email, setEmailId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(e.target.value);
    };

    return (
        <LitLoginWrapper>
            <CustomInputField
                InputType={'email'}
                name="email"
                placeholderText="Enter your email"
                value={email}
                handleChange={handleChange}
            />
            <Terms acceptance={acceptance} setAcceptance={setAcceptance} />
            <CustomButtom
                text="Submit"
                handleClick={sendPasscode}
                isDisable={!emailRegex.test(email) || !acceptance}
            />
        </LitLoginWrapper>
    );
};

export default LitLogin;