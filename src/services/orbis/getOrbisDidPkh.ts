import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import { generatePkpWalletInstance } from "./generatePkpWallet";
import { orbisdb } from "./orbisConfig";
import { OrbisConnectResult } from "@useorbis/db-sdk";

export async function connectOrbisDidPkh() {
    let auth;

    try {
        const sessionSigs = localStorage.getItem("signature");
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