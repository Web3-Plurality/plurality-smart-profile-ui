import { useState } from 'react'
import WalletTabs from './Tabs'
import ReceiveTab from './ReceiveTab'
import BalanceTab from './BalanceTab'
import SendTab from './SendTab'
import { useDispatch } from 'react-redux'
import { setWalletTab } from '../../Slice/userDataSlice'
import { SelectedNetworkType } from '../../types'
import { getLocalStorageValueofClient } from '../../utils/Helpers'
import { CLIENT_ID } from '../../utils/EnvConfig'


const Wallet = () => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { walletData: SupportedNetwork } = getLocalStorageValueofClient(`clientID-${clientId}`)

    const [activeTab, setActiveTab] = useState('balance')
    const [selectedNetwork, setSelectedNetwork] = useState(SupportedNetwork?.[0]);

    const handleSelectedNetworkChnage = (network: SelectedNetworkType) => {
        setSelectedNetwork(network)
    }

    const dispatch = useDispatch()

    const handleTabClick = (tab: string) => {
        dispatch(setWalletTab(tab))
        setActiveTab(tab)
    }

    const defaultMargin = activeTab === 'balance' ? '-104px' : activeTab === 'send' ? '-4px' : '60px';

    return (
        <>
            <WalletTabs activeTab={activeTab} handleTabClick={handleTabClick} tabMargin={defaultMargin} />
            {activeTab === 'balance' ? (
                <BalanceTab
                    tab={activeTab}
                    selectedNetwork={selectedNetwork}
                    handleSelectedNetworkChange={handleSelectedNetworkChnage} />
            ) : activeTab === 'send' ? (
                <SendTab />
            ) : activeTab === 'receive' ? (
                <ReceiveTab
                    tab={activeTab}
                    selectedNetwork={selectedNetwork}
                    handleSelectedNetworkChange={handleSelectedNetworkChnage} />
            ) : ''}
        </>
    )
}

export default Wallet

