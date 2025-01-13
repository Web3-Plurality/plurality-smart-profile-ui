import styled from 'styled-components'

import TsxFooterSection from './tsxFooterSection';
import TsxBodySection from './tsxBodySection';
import TsxDetailsBodySection from './tsxDetailsBodySection';
import { useState } from 'react';
import { CLIENT_ID } from '../../utils/EnvConfig';
import { getLocalStorageValueofClient } from '../../utils/Helpers';
import { useSelector } from 'react-redux';
import { selectTransactionData } from '../../selectors/userDataSelector';
import { SelectedNetworkType } from '../../types';

const TransactionWrapper = styled.div`
    width: 100%;
    .balance-info{
        display: flex;
        justify-content: center;
        align-items: center;
        color: #3771C8;
        font-size: 11px;
        margin-bottom: -20px;
        font-weight: 600;
    }


    h1{
        margin-top: 20px;
        margin-bottom: 4px;
    }

    .addresses{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 40px;
        gap: 6px;

        p{
            color: #545454;
        }
    }

    .details{
        color: #3771C8;
        font-size: 11px;
        margin: 0;
        text-decoration: underline;
        cursor: pointer;
        text-align: center;
    }
    
`;

const Transaction = () => {
    const [showDetails, setShowDetails] = useState(false)

    const { raw_transaction, chain_id } = useSelector(selectTransactionData)
    const tsxData = JSON.parse(raw_transaction)

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { pkpKey, walletData: SupportedNetwork } = getLocalStorageValueofClient(`clientID-${clientId}`)

    const chain = SupportedNetwork.find((item: SelectedNetworkType) => item.chainId === chain_id)

    const handleShowDetails = () => {
        setShowDetails(true)
    }

    const handleHideDetails = () => {
        setShowDetails(false)
    }


    return (
        <TransactionWrapper>
            {!showDetails ?
                <TsxBodySection handleClick={handleShowDetails} from={pkpKey?.ethAddress} tsxData={tsxData} chainToken={chain?.token || ''} /> :
                <TsxDetailsBodySection handleClick={handleHideDetails} from={pkpKey?.ethAddress} tsxData={tsxData} chainToken={chain?.token || ''} chainName={chain?.chainName || ''} />}
            <TsxFooterSection showDetails={showDetails} />
        </TransactionWrapper>
    )
}

export default Transaction
