/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { useAccount } from "wagmi";

import { goToStep } from "../Slice/stepperSlice";
import { setMetamaskPublicKey } from "../Slice/userDataSlice";
import { selectPublicKey } from "../selectors/userDataSelector";
import { ErrorMessages } from "../utils/Constants";

export const useRetrieveMetamaskPublicKey = () => {
    const { address } = useAccount();
    const dispatch = useDispatch()

    const storedPublicKey = useSelector(selectPublicKey)

    const getPublicKey = async () => {
        if (!address) {
            console.error("No accounts found. Please connect your MetaMask account.");
            return;
        }

        if (storedPublicKey) return storedPublicKey;

        try {
            // Request the encryption public key for the active account
            const encryptionPublicKey = await window.ethereum.request({
                method: 'eth_getEncryptionPublicKey',
                params: [address],
            });

            dispatch(setMetamaskPublicKey(encryptionPublicKey))
            return encryptionPublicKey;

        } catch (error: any) {
            handleError(error);
        }
    };

    const handleError = (error: any) => {
        if (error.code === -32603) {
            message.error(ErrorMessages.METAMASK_NOT_CONNECTED);
        } else {
            message.error(ErrorMessages.GENERAL_ERROR);
        }
        dispatch(goToStep('success'));
    };

    return {
        getPublicKey,
    };
};