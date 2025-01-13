import { Dropdown } from 'antd';
import SelectedNetwork from './selectedNetwork';
import { SelectedNetworkType } from '../../../types';
import { getLocalStorageValueofClient } from '../../../utils/Helpers';
import { CLIENT_ID } from '../../../utils/EnvConfig';


const DropdownMenu = ({ selectedNetwork, onChangeNetwork }: { border?: boolean; selectedNetwork: SelectedNetworkType, onChangeNetwork: (val: SelectedNetworkType) => void }) => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { walletData: SupportedNetwork } = getLocalStorageValueofClient(`clientID-${clientId}`)

    const items = SupportedNetwork.map((network: SelectedNetworkType, index: number) => ({
        key: index.toString(),
        label: (
            <div
                className="network-option"
                onClick={() => onChangeNetwork(network)}
            >
                <img src={network.icon} alt={network.chainName} />
                <span>{network.chainName}</span>
            </div>
        ),
    }));

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
                <SelectedNetwork name={selectedNetwork?.chainName} icon={selectedNetwork?.icon} />
            </a>
        </Dropdown>
    );
};

export default DropdownMenu;
