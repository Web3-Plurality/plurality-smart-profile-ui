import { Spin } from "antd";
// import PolygonIcon from './../../../assets/svgIcons/polygon.svg';
import { SelectedNetworkType } from "../../../types";

const BalanceDetails = ({ amount, loading, selectedNetwork }: { amount: string, loading: boolean, selectedNetwork: SelectedNetworkType }) => {
    return (
        <div className="balance-info-2">
            <div className="address">
                <p>Balance:
                    {loading ? (
                        <span className="spin-container">
                            <Spin size="small" />
                        </span>
                    ) : (
                        <span className="balance">
                            {/* $5.00 */}
                            <img src={selectedNetwork.icon} alt="polygon" />
                            <span className="balance-info">
                                {/* ( */}
                                <span>{amount} {selectedNetwork.token}</span>
                                {/* ) */}
                            </span>
                        </span>
                    )}
                </p>
            </div>
            <div className="chain">
                <p>+ Buy (Soon)</p>
            </div>
        </div>
    );
};

export default BalanceDetails;
