import { Divider } from "antd";
import GlobalStyles from './globalStyles';
import BalanceInfo from './balanceInfo';
import BalanceDetails from './balanceDetails';
import { BalanceTabWrapper } from './../StyledComponents';
import { useEffect, useState } from "react";
import { SelectedNetworkType } from "../../../types";
import { getBalance } from "../../../services/ethers/ethersService";
import { ethers } from "ethers";


const BalanceTab = ({ tab, selectedNetwork, handleSelectedNetworkChange: handleSelectedNetworkChange }: { tab: string, selectedNetwork: SelectedNetworkType, handleSelectedNetworkChange: (val: SelectedNetworkType) => void }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [amount, setAmount] = useState('')

    const fetchUpdatedBalance = async (rpc: string) => {
        setLoading(true); // Set loading to true before fetching balance
        try {
            const res = await getBalance(rpc);
            if (res) {
                setAmount(ethers.formatEther(res._hex))
            }
            // You can set the balance here if needed, depending on the structure of `res`
        } catch (error) {
            console.error("Error fetching balance:", error);
        } finally {
            setLoading(false); // Set loading to false after balance is fetched
        }
    };

    useEffect(() => {
        fetchUpdatedBalance(selectedNetwork.rpc);
    }, [selectedNetwork.chainId]);

    return (
        <>
            <GlobalStyles />
            <BalanceTabWrapper tab={tab}>
                <div className="balance-tab-content">
                    <BalanceInfo
                        selectedNetwork={selectedNetwork}
                        handleSelectedNetworkChange={handleSelectedNetworkChange} />
                    <Divider />
                    <BalanceDetails loading={loading} amount={amount} selectedNetwork={selectedNetwork} />
                </div>
            </BalanceTabWrapper>
        </>
    );
};

export default BalanceTab;
