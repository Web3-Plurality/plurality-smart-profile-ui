import classNames from 'classnames';
import WalletCopyIcon from './../../../assets/svgIcons/wallet-copy-icon.svg';
import DropdownMenu from './dropdownMenu';
import { getAccount } from '../../../services/ethers/ethersService';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getParentUrl } from '../../../utils/Helpers';
import { SelectedNetworkType } from '../../../types';

const BalanceInfo = ({ border = false, selectedNetwork, handleSelectedNetworkChange }: { border?: boolean; selectedNetwork: SelectedNetworkType, handleSelectedNetworkChange: (val: SelectedNetworkType) => void }) => {
    const [myAddress, setMyAddress] = useState("0x123...7890");
    const parentUrl = getParentUrl()
    useEffect(() => {
        const fetchAddress = async () => {
            const account = await getAccount();
            setMyAddress(account)
        }
        fetchAddress();
    }, []);

    const truncate = (address: string) => {
        return address.slice(0, 4) + "..." + address.slice(-4)
    }

    const handleCopyAddress = async () => {
        await navigator.clipboard.writeText(myAddress);
        window.parent.postMessage({ type: 'copyText', text: myAddress }, parentUrl);
        message.success('Address copied!');
    };

    return (
        <div className={classNames("balance-info-1", { isBorder: border })}>
            <div className="address">
                {/* {border && <span>Your Wallet</span>} */}
                <p className="address-text">{truncate(myAddress)}</p>
                <img src={WalletCopyIcon} alt="copy wallet" onClick={handleCopyAddress} />
            </div>
            <DropdownMenu selectedNetwork={selectedNetwork} onChangeNetwork={handleSelectedNetworkChange} />
        </div>
    );
};

export default BalanceInfo;
