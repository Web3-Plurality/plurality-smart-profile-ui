import styled from "styled-components";
import { Divider } from "antd";
import { ethers } from 'ethers';
import tsxDownArrow from './../../assets/svgIcons/tsx-down-icon.svg';

const TsxDetailsBodySectionWrapper = styled.div`
  padding: 10px 0;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  
  p{
    margin: 0;
  }
  
  .ant-divider-horizontal{
    margin: 10px 0;
    border-width: 2px;
  }
`;

const AdrressInfoWrapper = styled.div`
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  .label {
    font-size: 10px;
    margin: 3px 0;
    color: #ACACAC;
  }
  .address {
    font-size: 12px;
    color: #000;
    width: 120px;  /* Fixed width for the address */
    white-space: nowrap;  /* Prevent line break */
    overflow: hidden;  /* Hide overflowing text */
    text-overflow: ellipsis;  /* Add ellipsis for overflowing text */
  }
  img {
    width: 12px;
    margin: 10px 0 3px 0;
  }
  .total-amount {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .amount {
    font-size: 20px;
    font-weight: 700;
    color: #4F4F4F;
  }
  .amount-info {
    font-size: 12px;
    color: #4F4F4F;
  }
`;

const GasFeeWrapper = styled.div`
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    font-size: 12px;
    color: #ACACAC;
  }
`;

const TotalCostWrapper = styled.div`
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    font-size: 12px;
    font-weight: 800;
    color: #000;
  }
`;

const NetworkInfoWrapper = styled.div`
  padding: 0 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    font-size: 12px;
    margin: 10px 0;
    color: #9B9B9B
  }
`;

const OverflowTextWrapper = styled.div`
  position: absolute;
  background: lightgray;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  width: 25px;
  height: 25px;
  padding: 2px;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
  cursor: pointer;

  .overflow-text {
    color: #3771C8;
    font-size: 9px;
    margin: 0;
    padding: 0;
    text-align: center;
    text-decoration: underline;
  }
`;

const TsxDetailsBodySection = ({ tsxData, from, chainToken, chainName, handleClick }: { tsxData: any, from: string, chainToken: string, chainName: string, handleClick: () => void }) => {
  const gasFee = Number(tsxData?.gasPrice) * Number(tsxData?.gasLimit)
  const tsxAmount = Number(tsxData?.value)
  const totalAmount = gasFee + tsxAmount
  return (
    <>
      <TsxDetailsBodySectionWrapper>
        <OverflowTextWrapper>
          <p className="overflow-text" onClick={handleClick}>
            Hide
          </p>
        </OverflowTextWrapper>

        <AdrressInfoWrapper>
          <div>
            <div className="tsx-info">
              <p className="label">From</p>
              <p className="address">{from}</p>
            </div>
            <img src={tsxDownArrow} alt="Arrow" />
            <div className="tsx-info">
              <p className="label">To</p>
              <p className="address">{tsxData?.to}</p>
            </div>
          </div>
          <div>
            <div className="total-amount">
              <p className="amount">{chainToken} {ethers.formatEther(JSON.stringify(tsxAmount))}</p>
              {/* <p className="amount">$200</p> */}
              {/* <p className="amount-info">{chainToken} 0.01</p> */}
            </div>
          </div>
        </AdrressInfoWrapper>

        <Divider />

        <GasFeeWrapper>
          <p>Gas Fee</p>

          <p>{`~ ETH < ${ethers.formatEther(JSON.stringify(tsxAmount))}`}</p>
          {/* <p>{`~ $ < ${ethers.formatEther(JSON.stringify(totalAmount))}`}</p> */}
        </GasFeeWrapper>

        <Divider />

        <TotalCostWrapper>
          <p>Total Cost</p>
          <p>{`~ ETH ${ethers.formatEther(JSON.stringify(totalAmount))}`}</p>
        </TotalCostWrapper>
      </TsxDetailsBodySectionWrapper>

      <NetworkInfoWrapper>
        <p>Network Used</p>
        <p>{chainName}</p>
      </NetworkInfoWrapper>
    </>
  );
};

export default TsxDetailsBodySection;
