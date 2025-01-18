import styled from 'styled-components'
import BalanceInfo from './../BalanceTab/balanceInfo';

import GlobalStyles from './../BalanceTab/globalStyles';
import { BalanceTabWrapper } from './../StyledComponents';

import defaultQRCode from './../../../assets/images/qr-code.png'
import InfoIcon from './../../../assets/svgIcons/info-icon.svg'
import QRCode from "qrcode";
import { useEffect, useState } from 'react';
import { generatePkpWalletInstance } from '../../../services/orbis/generatePkpWallet';
import { SelectedNetworkType } from '../../../types';

const ReceiveTabWrapper = styled.div`
    max-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .qrcode{
        width: 120px;
        margin-bottom: 20px;
    }

    p{
        max-width: 80%;
        text-align: center;
    }
   
`

const InfoWrapper = styled.div`
    width: 85%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 30px;
    background-color: rgb(138, 192, 255, 0.7);
    padding: 0 10px;
    border-radius: 10px;

    p{

        font-size: 12px;
        text-align: center;
    }
   
`

const ReceiveTab = ({ tab, selectedNetwork, handleSelectedNetworkChange }: { tab: string, selectedNetwork: SelectedNetworkType, handleSelectedNetworkChange: (val: SelectedNetworkType) => void }) => {
    const [currentQRCode, setCurrentQRCode] = useState(defaultQRCode);
    useEffect(() => {
        // by default we generate sepolia QR code
        const generateSepoliaQRCode = async () => {
            const pkpWallet = await generatePkpWalletInstance();
            const address = await pkpWallet!.getAddress();
            const uri = `ethereum:${address}@${selectedNetwork.chainId}`;
            try {
                const qrCode = await QRCode.toDataURL(uri);
                setCurrentQRCode(qrCode)
            } catch (err) {
                console.error("Error generating Sepolia QR code:", err);
                throw err;
            }
        }
        generateSepoliaQRCode();
    }, [selectedNetwork]);

    return (
        <>
            <GlobalStyles />
            <BalanceTabWrapper tab={tab}>
                <ReceiveTabWrapper>
                    <p>Scan this code or copy your address to receive your funds on {selectedNetwork.chainName}</p>
                    <img src={currentQRCode} className='qrcode' />
                    <BalanceInfo
                        border={true}
                        selectedNetwork={selectedNetwork}
                        handleSelectedNetworkChange={handleSelectedNetworkChange} />
                </ReceiveTabWrapper>
            </BalanceTabWrapper>
            <InfoWrapper>
                <img src={InfoIcon} />
                <p>Make sure to send funds on {selectedNetwork.chainName}</p>
            </InfoWrapper>

        </>
    )
}

export default ReceiveTab
