import styled from "styled-components";
import CustomButtom from "../customButton";
import { sendUserConsentEvent } from "../../utils/sendEventToParent";
import { useSelector } from "react-redux";
import { selectContratData } from "../../selectors/userDataSelector";
import { writeToContract } from "../../services/ethers/ethersService";
import { getParentUrl } from "../../utils/Helpers";
import { useState } from "react";
import { message } from "antd";

const ConsentFooterWrapper = styled.div`
    width: 340px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    margin-bottom: -60px;

    @media (max-width: 576px) {
        width: 340px;
    }

    @media (max-width: 380px) {
        justify-content: center;
        width: 190px;
    }
`;


const ContractFooterSection = () => {
    const [loading, setLoading] = useState(false);
    const contractData = useSelector(selectContratData)

    const parentUrl = getParentUrl()

    const handleCancelWriteContract = () => {
        sendUserConsentEvent()
    }

    const handleAcceptWriteContract = async () => {
        setLoading(true); // Set loading to true when the button is clicked
        try {
            const response = await writeToContract(contractData);
            if (response) {
                message.success("Transaction successfull")
                window.parent.postMessage({ id: contractData?.id, eventName: 'writeToContract', data: JSON.stringify(response) }, parentUrl);
            }
        } catch (error) {
            console.error(error);
            window.parent.postMessage({ id: contractData?.id, eventName: 'errorMessage', data: 'Something went Wrong' }, parentUrl);
        } finally {
            setLoading(false);
            sendUserConsentEvent()
        }
    };

    return (
        <ConsentFooterWrapper>
            <CustomButtom
                text='Cancel'
                minWidth='130px'
                theme={'light'}
                consent={true}
                handleClick={handleCancelWriteContract}
            />
            <CustomButtom
                text='Accept'
                minWidth='130px'
                theme={'dark'}
                consent={true}
                loader={loading}
                handleClick={handleAcceptWriteContract}
            />
        </ConsentFooterWrapper>
    )
}

export default ContractFooterSection
