import { AccessControlConditions } from "@lit-protocol/types";

export const getAccessControlConditions = async (): Promise<AccessControlConditions> => {
    const currentPkp = localStorage.getItem('pkpKey')

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
                value: currentPkp ? JSON.parse(currentPkp).ethAddress : ''
            },
        },
    ];
    return accessControlConditions;
};