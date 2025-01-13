import styled from 'styled-components'
import CustomButtom from './../../customButton';
import { sendTransaction } from '../../../services/ethers/ethersService';
import { sendUserConsentEvent } from '../../../utils/sendEventToParent';
import { useState } from 'react';
import { getLocalStorageValueofClient, getParentUrl } from '../../../utils/Helpers';
import { CLIENT_ID } from '../../../utils/EnvConfig';
import { SelectedNetworkType } from '../../../types';

const ConsentFooterWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`;

type sendTransactionProps = {
    toAddress: string,
    amount: string,
    chainId: string,
}


const SendTabFooter = ({
    toAddress,
    amount,
    chainId
}: sendTransactionProps) => {
    const [loading, setLoading] = useState(false)

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { walletData: SupportedNetwork } = getLocalStorageValueofClient(`clientID-${clientId}`)

    const parentUrl = getParentUrl()
    const network = SupportedNetwork.find((chain: SelectedNetworkType) => chain.chainId === chainId);

    const rpc = network ? network.rpc : '';
    const send = async () => {
        const inBigIntAmount = Number(amount) * (10 ** 18)
        const rawTransaction = {
            chainId: chainId,
            value: inBigIntAmount.toString(),
            to: toAddress,
            gasLimit: "21000",
            gasPrice: "50000000000",
        }

        setLoading(true);
        try {
            const receipt = await sendTransaction({ rpc, chain_id: chainId, raw_transaction: JSON.stringify(rawTransaction), isWallet: true });

            if (receipt) {
                window.parent.postMessage({ eventName: 'walletSendTransaction', data: JSON.stringify(receipt) }, parentUrl);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const reject = () => {
        sendUserConsentEvent()
    }

    return (
        <ConsentFooterWrapper>
            <CustomButtom
                text='Cancel'
                minWidth='120px'
                theme={'light'}
                consent={true}
                handleClick={reject}
            />
            <CustomButtom
                text='Accept'
                minWidth='120px'
                theme={'dark'}
                consent={true}
                loader={loading}
                isDisable={!toAddress || !amount}
                handleClick={send}
            />
        </ConsentFooterWrapper>
    )
}

export default SendTabFooter
