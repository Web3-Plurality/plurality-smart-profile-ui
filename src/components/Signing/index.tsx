import styled from "styled-components"
import SigningFooter from "./signingFooter"
import { selectMessageToBeSigned } from "../../selectors/userDataSelector"
import { useSelector } from "react-redux"
import { getParentHost } from "../../utils/Helpers"

const SigningWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p{
        max-width: 85%;
        text-align: center;
        margin-top: 45px;
        color: #545454;

        span{
            color: #545454;
            font-weight: 600;
        }
    }

    .signing-message{
        font-size: 16px;
        color: #3771C8;
        margin-top: 20px;
    }

`

const Signing = () => {
    const { message } = useSelector(selectMessageToBeSigned)
    const dApp = getParentHost()
    return (
        <SigningWrapper>
            <p><span>{dApp}</span> is requesting your sign on the folowing message</p>
            <span className="signing-message">{message}</span>

            <SigningFooter />
        </SigningWrapper>
    )
}

export default Signing
