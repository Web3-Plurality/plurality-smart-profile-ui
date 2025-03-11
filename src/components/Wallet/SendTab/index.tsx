import { useState, ChangeEvent } from "react";
import styled from "styled-components";
import { Divider, Select } from "antd";
import SendTabFooter from "./footerSection";
import { CaretDownOutlined, CaretUpFilled } from "@ant-design/icons";
import { CLIENT_ID } from "../../../utils/EnvConfig";
import { getLocalStorageValueofClient } from "../../../utils/Helpers";
import { SelectedNetworkType } from "../../../types";

// Styled component with custom styling
const SendTabWrapper = styled.div`
    width: 370px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 15px;
    margin-top: 40px;
    
    p{
        margin: 0;
        font-size: 14px;
        color: #000;
    }

    .send-tab-chain, .send-tab-token, .send-tab-to, .send-tab-from{
        padding: 5px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .send-tab-chain-content, .send-tab-token-content{
        display: flex;
        justify-content: space-between;
        margin-top: 1px;

        .chain-options{
            display: flex;
            gap: 0.3rem;

            p{
                background-color: #D9D9D9;
                padding: 2px 7px;
                border-radius: 5px;
            }
        }
    }

    .send-tab-to, .send-tab-from{
      display: flex;
      flex-direction: column;
    }

    .ant-divider-horizontal{
        margin: 0;
    }

    label{
        color: #ACACAC;
        font-size: 12px;
    }

    input{
        outline: none;
        border: none;
        cursor: pointer;

        &::placeholder {
        font-size: 10px;
        color: #acacac;
  }
    }

    /* Removing border from Select */
    .ant-select-selector {
        padding: 0 10px;
        height: 30px !important;
        display: flex;
        align-items: center;
        background-color: #D9D9D9;
        font-size: 12px;
        border: 1px solid #acacac !important;
        border-radius: 12px !important;
        font-family: 'Lexend', 'Poppins', sans-serif;   
    }

    .ant-select-dropdown {
        border: none !important;
        background-color: transparent !important;
        box-shadow: none !important;
    }

    .ant-select-arrow {
        font-size: 12px;
    }

    .send-tab-chain-content, .send-tab-token-content{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

const { Option } = Select;

const SendTab = () => {
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [chainId, setChainId] = useState("11155111");
    const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;
    const { walletData: SupportedNetwork } = getLocalStorageValueofClient(`clientID-${clientId}`)

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
        setToAddress(event.target.value);
    };

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Allow only numbers and one decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleChainChange = (value: string) => {
        setChainId(value);
    };

    const handleChainDropdownChange = (open: boolean) => {
        setIsChainDropdownOpen(open);
    };

    return (
        <>
            <SendTabWrapper>
                <div className="send-tab-chain">
                    <label>Chain</label>
                    <div className="send-tab-chain-content">
                        <p>{SupportedNetwork.find((chain: SelectedNetworkType) => chain.chainId === chainId)?.chainName}</p>

                        <Select
                            value={chainId}
                            onChange={handleChainChange}
                            onDropdownVisibleChange={handleChainDropdownChange}
                            style={{ width: 'auto' }}
                            suffixIcon={isChainDropdownOpen ? <CaretUpFilled /> : <CaretDownOutlined />} // Change caret based on dropdown state
                        >
                            {SupportedNetwork.map((chain: SelectedNetworkType) => (
                                <Option key={chain.chainId} value={chain.chainId}>
                                    {chain?.chainName}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <Divider />
                <div className="send-tab-token">
                    <label>Token</label>
                    <div className="send-tab-token-content">
                        <p>{SupportedNetwork.find((chain: SelectedNetworkType) => chain.chainId === chainId)?.token}</p>
                    </div>
                </div>
                <Divider />
                <div className="send-tab-to">
                    <label>To</label>
                    <input value={toAddress} placeholder="Enter recipient address" onChange={handleAddressChange} />
                </div>
                <Divider />
                <div className="send-tab-from">
                    <label>Amount</label>
                    <input
                        value={amount}
                        type="text"
                        inputMode="decimal"
                        placeholder="Enter amount"
                        onChange={handleAmountChange}
                    />
                </div>
                <Divider style={{ paddingBottom: "12px" }} />
            </SendTabWrapper>
            <SendTabFooter toAddress={toAddress} amount={amount} chainId={chainId} />
        </>
    );
};

export default SendTab;
