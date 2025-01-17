import styled from "styled-components";
import CustomButtom from "../customButton";
import { sendUserConsentEvent } from "../../utils/sendEventToParent";
import { useSelector } from "react-redux";
import { selectTransactionData } from "../../selectors/userDataSelector";
import { sendTransaction } from "../../services/ethers/ethersService";
import { getParentUrl } from "../../utils/Helpers";
import { useState } from "react";
import { message } from "antd";

const ConsentFooterWrapper = styled.div<{ showDetails: boolean }>`
    width: 340px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${({ showDetails }) => (showDetails ? '-10px' : '20px')};

    @media (max-width: 576px) {
        width: 340px;
    }

    @media (max-width: 380px) {
        justify-content: center;
        width: 190px;
    }
`;


const TsxFooterSection = ({ showDetails }: { showDetails: boolean }) => {
    const [loading, setLoading] = useState(false);
    const txData = useSelector(selectTransactionData)

    const parentUrl = getParentUrl()

    const handleCancelTransaction = () => {
        sendUserConsentEvent()
        window.parent.postMessage({ id: txData.id, eventName: 'sendTransaction', data: JSON.stringify('User rejected the transaction') }, parentUrl);
    }

    const handleAcceptTransaction = async () => {
        setLoading(true); // Set loading to true when the button is clicked
        try {
            const receipt = await sendTransaction(txData);
            if (receipt) {
                message.success("Transaction successfull")
                window.parent.postMessage({ id: txData.id, eventName: 'sendTransaction', data: JSON.stringify(receipt) }, parentUrl);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            sendUserConsentEvent()
        }
    };

    return (
        <ConsentFooterWrapper showDetails={showDetails}>
            <CustomButtom
                text='Cancel'
                minWidth='130px'
                theme={'light'}
                consent={true}
                handleClick={handleCancelTransaction}
            />
            <CustomButtom
                text='Accept'
                minWidth='130px'
                theme={'dark'}
                consent={true}
                loader={loading}
                handleClick={handleAcceptTransaction}
            />
        </ConsentFooterWrapper>
    )
}

export default TsxFooterSection
