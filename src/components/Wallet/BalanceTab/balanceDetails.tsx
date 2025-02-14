import { SelectedNetworkType } from "../../../types";
import { LoadingOutlined } from "@ant-design/icons";

const BalanceDetails = ({ amount, loading, selectedNetwork }: { amount: string, loading: boolean, selectedNetwork: SelectedNetworkType }) => {
    return (
        <div className="balance-info-2">
            <div className="address">
                <p>Balance:           </p>
                    {loading ? (
                        <LoadingOutlined style={{ fontSize: '16px', marginLeft: "10px" }} />
                    ) : (
                        <div className="balance">
                            <img src={selectedNetwork.icon} alt="polygon" />
                            <span>{amount} {selectedNetwork.token}</span>
                            {/* <span className="balance-info">
                               
                            </span> */}
                        </div>
                    )}
            </div>
            <div className="chain">
                <p>+ Buy (Soon)</p>
            </div>
        </div>
    );
};

export default BalanceDetails;
