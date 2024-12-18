import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAccessControlConditions } from "./accessControllConditions";
import { litNodeClient } from "../Lit";



export const litEncryptData = async (message: string):
    Promise<{ ciphertext: string; dataToEncryptHash: string } | undefined> => {
    try {
        await litNodeClient.connect();
        const accessControlConditions = await getAccessControlConditions();

        const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
            {
                accessControlConditions,
                dataToEncrypt: message,
            },
            litNodeClient,
        );

        // Return the ciphertext and dataToEncryptHash
        return {
            ciphertext,
            dataToEncryptHash,
        }
    } catch (err) {
        console.error(err);
    }
}