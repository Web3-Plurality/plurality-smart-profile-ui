import { OrbisConnectResult, OrbisDB } from "@useorbis/db-sdk";
import { OrbisEVMAuth, OrbisKeyDidAuth } from "@useorbis/db-sdk/auth";
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import {
    CEREMAIC_URL,
    ORBIS_ENV,
    ORBIS_NODE_URL,
    PLURALITY_CONTEXT,
    INDIVIDUAL_PROFILE_MODEL,
    SMART_PROFILE_MODEL,
    PROFILE_TYPE_MODEL,
    socialConnectButtons,
} from "./constants";
import { litNodeClient } from "./lit";

type ValidationResult = { valid: true } | { valid: false; error: string };

const orbisdb = new OrbisDB({
    ceramic: { gateway: CEREMAIC_URL },
    nodes: [{ gateway: ORBIS_NODE_URL, env: ORBIS_ENV }]
})

const data = {
    contexts: { plurality: PLURALITY_CONTEXT },
    models: {
        individual_profile: INDIVIDUAL_PROFILE_MODEL,
        smart_profile: SMART_PROFILE_MODEL,
        profile_type: PROFILE_TYPE_MODEL
    }
}

const generatePkpWalletInstance = async () => {
    const sessionSigs = localStorage.getItem("signature")
    const pkp = localStorage.getItem("pkpKey")
    if (sessionSigs && pkp) {
        const pkpWallet = new PKPEthersWallet({
            controllerSessionSigs: JSON.parse(sessionSigs),
            pkpPubKey: JSON.parse(pkp).publicKey,
            litNodeClient: litNodeClient,
            // provider: new ethers.providers.JsonRpcProvider("https://yellowstone-rpc.litprotocol.com/"),
            debug: true
        });
        await pkpWallet.init();
        return pkpWallet
    }
}

// async function createHash(data: string) {
//     const encoder = new TextEncoder();
//     const dataBuffer = encoder.encode(data);

//     // Generate a SHA-256 hash
//     const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);

//     // Convert the hash to a hex string
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

//     return hashHex;
// }

// const createSigature = async () => {
//     // const email = localStorage.getItem("user") as string
//     const userId = JSON.parse(localStorage.getItem("userData") as string).id

//     const wallet = await generatePkpWalletInstance()
//     const signature = await wallet?.signMessage(userId);
//     return signature
// }

// Will connect user to OrbisDB  Phantom or Metamask 
export async function connectOrbisDidPkh() {
    let auth;

    try {
        const sessionSigs = localStorage.getItem("signature");
        if (sessionSigs) {

            const pkpWallet = await generatePkpWalletInstance();
            auth = new OrbisEVMAuth(pkpWallet!);

            // const sigedData = await createSigature();
            /*const userId = JSON.parse(localStorage.getItem("userData") as string).id
            const hasedUser = await createHash(userId as string);
            auth = await OrbisKeyDidAuth.fromSeed(hasedUser);*/
        } else {
            auth = new OrbisEVMAuth(window.ethereum);
        }

        const authResult: OrbisConnectResult = await orbisdb.connectUser({ auth });

        if (authResult?.user) {
            return authResult.user;
        } else {
            return "";
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

export async function connectOrbisDidKey() {
    // Generate the seed
    const seed = await OrbisKeyDidAuth.generateSeed()
    // Initiate the authneticator using the generated (or persisted) seed
    const auth = await OrbisKeyDidAuth.fromSeed(seed)
    try {
        // Authenticate the user and persist the session in localStorage
        const authResult: OrbisConnectResult = await orbisdb.connectUser({ auth })
        if (authResult?.user) {
            // Log the result
            return authResult.user;
            //setUser(authResult.user);
        }
        return "";
    } catch (e) {
        console.log("Error connecting user:", e);
        return "";
    }
}

// Will reconnect user automatically if we find a session in local storage 
export async function autoConnect() {
    try {
        const currentUser: OrbisConnectResult | boolean = await orbisdb.getConnectedUser();
        if (currentUser) {
            return currentUser.user;
            //setUser(currentUser.user);
        }
        return "";
    }
    catch (error) {
        console.log(error);
        return "";
    }
}

/** Will disconnect the user */
export async function userLogout() {
    try {
        const res = await orbisdb.disconnectUser();
        //setUser(null);
        console.log("res:", res);
        return "done";
    }
    catch (error) {
        console.log(error);
    }
}

/** Will retrieve the active profile for the connected user */
export async function getMostRecentDataFromTable(did: string) {
    try {
        const _profileRes = await orbisdb.select().from(data.models.profile_type).context(PLURALITY_CONTEXT)
            .where({ "controller": did.toString() }).orderBy(["indexed_at", "desc"]).run();
        if (_profileRes && _profileRes.rows.length > 0) {
            return _profileRes.rows[0];
            //setProfile(_profileRes.rows[0])
        } else {
            return null;
            //setProfile(null);
        }
    } catch (e) {
        console.log("Error retrieving profile:", e);
        return null;
        //setProfile(null);
    }
}


export async function insert(msg: string) {
    const insertStatement = await orbisdb
        .insert(data.models.profile_type)
        .value(
            {
                TestProperty: msg
            }
        )
        // optionally, you can scope this insert to a specific context
        .context(PLURALITY_CONTEXT);

    // Perform local JSON Schema validation before running the query
    const validation: ValidationResult = await insertStatement.validate()
    if (!validation.valid) {
        throw "Error during validation: " + validation.error
    }

    try {
        const result = await insertStatement.run();
        console.log(result);
        return result

    }
    catch (error) {
        console.log(error);
    }
}

export async function bulkInsert() {
    const insertStatement = await orbisdb
        .insertBulk(data.models.profile_type)
        .value(
            {
                TestProperty: "test"
            }
        )
        // optionally, you can scope this insert to a specific context
        .context(PLURALITY_CONTEXT);

    // Perform local JSON Schema validation before running the query
    const validation = await insertStatement.validate() as ValidationResult
    if (!validation.valid) {
        throw "Error during validation: " + validation.error
    }

    try {
        const { success, errors } = await insertStatement.run()
        if (errors.length) {
            console.error("Errors occurred during execution", errors)
        }
        console.log(success);
    }
    catch (error) {
        console.log(error);
    }
    // All runs of a statement are stored within the statement, in case you want to reuse the same statmenet
}

export async function update(stream_id: string) {
    // This will replace the provided row with provided values
    const updateStatement = await orbisdb
        .update(stream_id)
        .replace(
            {
                TestProperty: "test-updated"
            }
        )

    try {
        const result = await updateStatement.run();
        console.log(result);
    }
    catch (error) {
        console.log(error);
    }

    // All runs of a statement are stored within the statement, in case you want to reuse the same statmenet
}

export async function partialUpdate() {
    // This will perform a shallow merge before updating the document 
    // { ...oldContent, ...newContent }
    const updateStatement = await orbisdb
        .update(data.models.profile_type)
        .set(
            {
                TestProperty: "test-updated"
            }
        )

    try {
        const result = await updateStatement.run();
        console.log(result);
    }
    catch (error) {
        console.log(error);
    }
    // All runs of a statement are stored within the statement, in case you want to reuse the same statmenet
}

export async function select(stream_id: string) {
    try {
        const selectStatement = await orbisdb
            .select()
            .from(data.models.profile_type)
            .where({
                stream_id: stream_id
            })
            .context(PLURALITY_CONTEXT)

        const query = selectStatement.build()
        console.log("Query that will be run", query)
        const result = await selectStatement.run();
        console.log(result);
        const fetchedPlatforms = JSON.parse(result.rows[0].platforms)
        let neededPlatforms = []
        // set platforms this workflow needs
        for (const platform of socialConnectButtons) {
            // in order to minimize the changes, we use the contant as our maximal platforms, and we iterate over it based on the platforms we fetched from orbis
            if (fetchedPlatforms.find((x) => x.platform === platform.displayName)) {
                neededPlatforms.push(platform)
            }
        }
        // columns: Array<string>
        // rows: Array<T | Record<string, any>>
        const { columns, rows } = result
        console.log("select first: ", { columns, rows, neededPlatforms });
        return { columns, rows, neededPlatforms };
    }
    catch (error) {
        console.log("Error", error)
    }
}

export async function selectSmartProfiles(stream_id: any) {
    try {
        const didKey = localStorage.getItem("userDid")
        const selectStatement = await orbisdb
            .select()
            .from(data.models.smart_profile)
            .where({
                profile_type_stream_id: stream_id,
                controller: didKey ? JSON.parse(didKey) : ''
                ////address
            })
            .orderBy(["indexed_at", "desc"])
            .context(PLURALITY_CONTEXT)

        const query = selectStatement.build()
        console.log("Query that will be run", query)
        const result = await selectStatement.run();
        console.log(result);
        // columns: Array<string>
        // rows: Array<T | Record<string, any>>
        const { columns, rows } = result
        return { columns, rows };
    }
    catch (error) {
        console.log("Error", error)
    }
}

export async function insertSmartProfile(encrypted_profile_data: string, scores: string, version = '1', connectedPlatforms: string, stream_id: string) {
    const insertStatement = await orbisdb
        .insert(data.models.smart_profile)
        .value(
            {
                encrypted_profile_data: encrypted_profile_data,
                scores: scores,
                connected_platforms: connectedPlatforms,
                version: version,
                profile_type_stream_id: stream_id,
            }
        )
        // optionally, you can scope this insert to a specific context
        .context(PLURALITY_CONTEXT);

    // Perform local JSON Schema validation before running the query
    const validation: ValidationResult = await insertStatement.validate()
    if (!validation.valid) {
        throw "Error during validation: " + validation.error
    }

    try {
        const result = await insertStatement.run();
        return result
    }
    catch (error) {
        console.log(error);
    }
}

export async function insertIndividualProfile(encrypted_profile_data: string, scores: string, version = '1', platformName: string) {
    const insertStatement = await orbisdb
        .insert(data.models.individual_profile)
        .value(
            {
                platform_name: platformName,
                encrypted_profile_data,
                scores,
                version: version,
            }
        )
        // optionally, you can scope this insert to a specific context
        .context(PLURALITY_CONTEXT);

    // Perform local JSON Schema validation before running the query
    const validation: ValidationResult = await insertStatement.validate()
    if (!validation.valid) {
        throw "Error during validation: " + validation.error
    }

    try {
        const result = await insertStatement.run();
        console.log("Result: ", result)
        return result
    }
    catch (error) {
        console.log(error);
    }
}