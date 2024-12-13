import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import { generatePkpWalletInstance } from "./generatePkpWallet";
import { orbisdb } from "./orbisConfig";
import { OrbisConnectResult } from "@useorbis/db-sdk";
import { getLocalStorageValueofClient } from "../../utils/Helpers";
import { CLIENT_ID } from "../../utils/EnvConfig";

export async function connectOrbisDidPkh() {
    let auth;
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { signature: sessionSigs } = getLocalStorageValueofClient(`clientID-${clientId}`)
    try {
        if (sessionSigs) {
            const pkpWallet = await generatePkpWalletInstance();
            auth = new OrbisEVMAuth(pkpWallet!);
        } else {
            auth = new OrbisEVMAuth(window.ethereum);
        }

        const authResult: OrbisConnectResult = await orbisdb.connectUser({ auth });

        if (authResult) {
            return authResult.user;
        }
    } catch (err: unknown) {
        if (err && typeof err === 'object') {
            const errorWithCode = err as { code: number };
            if (errorWithCode.code === 4001) {
                return 'error'
            }
        }
    }
}