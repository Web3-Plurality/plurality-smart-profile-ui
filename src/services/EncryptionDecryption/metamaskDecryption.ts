/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from "antd";
import { ErrorMessages } from "../../utils/Constants";

export const metamaskDecryptData = async (encryptedData: string) => {
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
        const decrypt = await window.ethereum.request({
            method: 'eth_decrypt',
            params: [`0x${Buffer.from(encryptedData, "utf8").toString("hex")}`, accounts[0]],
        });
        return decrypt
    } catch (err: any) {
        if (err.code === -32603) {
            return err
        } else {
            message.error(ErrorMessages.GENERAL_ERROR)
            console.error("An error occurred while getting the encryption public key:", err);
        }
    }
}