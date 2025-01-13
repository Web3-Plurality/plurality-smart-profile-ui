import styled from 'styled-components'
import { ethers } from 'ethers';
import ethLogo from './../../assets/svgIcons/ethereum-logo.svg'
import tsxForwardIcon from './../../assets/svgIcons/tsx-forward-icon.svg'
import { truncateAddress } from '../../utils/Helpers';
// import { SupportedNetwork } from '../../utils/Constants';

const BalanceWrapper = styled.p`
    text-align: center;
    font-size: 40px !important;
    margin: 30px 0 0 0;
    font-weight: 700;
`;

const TsxBodySection = ({ tsxData, from, chainToken, handleClick }: { tsxData: any, from: string, chainToken: string, handleClick: () => void }) => {

    return (
        <>
            {/* <BalanceWrapper>$200</BalanceWrapper> */}
            <BalanceWrapper>
                <img src={ethLogo} />
                <span>{ethers.formatEther(tsxData?.value)} {chainToken}</span>
            </BalanceWrapper>
            {/* <div className='balance-info'>
                <img src={ethLogo} />
                <span>${ethers.formatEther(tsxData?.value)} {chainToken}</span>
            </div> */}

            <div className='addresses'>
                <p>{truncateAddress(from)}</p>
                <img src={tsxForwardIcon} />
                <p>{truncateAddress(tsxData?.to)}</p>
            </div>

            <p className='details' onClick={handleClick}>Transaction Details</p>
        </>
    )
}

export default TsxBodySection
