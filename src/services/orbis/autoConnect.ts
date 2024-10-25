import { OrbisConnectResult } from "@useorbis/db-sdk";
import { orbisdb } from "./orbisConfig";

export async function autoConnect() {
    try {
        const currentUser: OrbisConnectResult | boolean = await orbisdb.getConnectedUser();
        if (currentUser) {
            return currentUser.user;
        }
    }
    catch (error) {
        console.log(error);
        return
    }
}