import { AccessControlConditions } from "@lit-protocol/types";
import { CLIENT_ID } from "../../utils/EnvConfig";
import { getLocalStorageValueofClient } from "../../utils/Helpers";

export const getAccessControlConditions = async (): Promise<AccessControlConditions> => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id') || CLIENT_ID;

    const { pkpKey: currentPkp } = getLocalStorageValueofClient(`clientID-${clientId}`)

    // Lit encrption & decrption
    const accessControlConditions: AccessControlConditions = [
        {
            contractAddress: "",
            standardContractType: "",
            chain: "ethereum", // todo: this needs to be ethereum otherwise throws an error! Need to see
            method: "",
            parameters: [":userAddress"],
            returnValueTest: {
                comparator: "=",
                value: currentPkp.ethAddress || ''
            },
        },
    ];
    return accessControlConditions;
};