import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { SessionSigsMap } from "@lit-protocol/types";
import { getAccessControlConditions } from "./accessControllConditions";
import { litNodeClient } from "../Lit";

export const litDecryptData = async (sessionSigs: SessionSigsMap, ciphertext: string, dataToEncryptHash: string) => {
    try {
        await litNodeClient.connect();
        const accessControlConditions = await getAccessControlConditions();

        const decryptedMessage = await LitJsSdk.decryptToString(
            {
                accessControlConditions,
                ciphertext: ciphertext,
                dataToEncryptHash: dataToEncryptHash,
                chain: 'ethereum',
                sessionSigs: sessionSigs
            },
            litNodeClient,
        );

        return { decryptedMessage }

    } catch (err) {
        console.error(err);
    }
}