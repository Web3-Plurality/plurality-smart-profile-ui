import { EyeInvisibleFilled, EyeFilled, LoadingOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import DropdownMenu from './dropdownMenu';
import { getAccount } from '../../../services/ethers/ethersService';
import { SelectedNetworkType } from '../../../types';

const IconWrapper = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  flex-shrink: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const AddressContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  word-break: break-all;
  justify-content: center;
`;

const AddressText = styled.p`
font-size: 13px !important;
  margin: 15px 0;
  word-break: break-all;
  overflow-wrap: break-word;
  min-width: 0;
  max-width: 80%;
  flex: 1;
`;

const BalanceInfo = ({
    border = false,
    selectedNetwork,
    handleSelectedNetworkChange
}: {
    border?: boolean;
    selectedNetwork: SelectedNetworkType;
    handleSelectedNetworkChange: (val: SelectedNetworkType) => void
}) => {
    const [myAddress, setMyAddress] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showFullAddress, setShowFullAddress] = useState(false);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const account = await getAccount();
                setMyAddress(account);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAddress();
    }, []);

    const truncate = (address: string) => {
        if (!address) return "";
        return showFullAddress ? address : address.slice(0, 4) + "..." + address.slice(-4);
    }

    return (
        <div className={classNames("balance-info-1", { isBorder: border })}>
            <AddressContainer>
                {isLoading ? (
                    <LoadingOutlined style={{ fontSize: '16px' }} />
                ) : (
                    <>
                        <AddressText className="address-text">{truncate(myAddress)}</AddressText>
                        <IconWrapper
                            onClick={() => setShowFullAddress(!showFullAddress)}
                            aria-label={showFullAddress ? "Hide full address" : "Show full address"}
                        >
                            {showFullAddress ? <EyeInvisibleFilled /> : <EyeFilled />}
                        </IconWrapper>
                    </>
                )}
            </AddressContainer>
            {!showFullAddress && <DropdownMenu
                selectedNetwork={selectedNetwork}
                onChangeNetwork={handleSelectedNetworkChange}
            />}
        </div>
    );
};

export default BalanceInfo;

