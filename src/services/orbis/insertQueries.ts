import { PLURALITY_CONTEXT } from "../../utils/EnvConfig";
import { data, orbisdb } from "./orbisConfig";

type ValidationResult = { valid: true } | { valid: false; error: string };

export async function insertSmartProfile(
    smartProfile: any) {
    
    // Serialize the profile object to required format
    smartProfile.scores = JSON.stringify(smartProfile.scores), 
    smartProfile.connectedPlatforms = JSON.stringify(smartProfile.connectedPlatforms), 
    smartProfile.extendedPublicData = JSON.stringify(smartProfile.extendedPublicData),
    smartProfile.attestation = JSON.stringify(smartProfile.attestation),
    smartProfile.privateData = JSON.stringify(smartProfile.privateData)

    //insert
    const insertStatement = await orbisdb
        .insert(data.models.smart_profile)
        .value(smartProfile)
        .context(PLURALITY_CONTEXT);

    // Perform local JSON Schema validation before running the query
    const validation: ValidationResult = await insertStatement.validate()
    if (!validation.valid) {
        throw "Error during validation: " + validation.error
    }

    try {
        const result = await insertStatement.run();
        console.log("Result (SP): ", result)
        return result
    }
    catch (error) {
        console.log(error);
    }
}
