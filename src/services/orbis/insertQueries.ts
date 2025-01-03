import { PLURALITY_CONTEXT } from "../../utils/EnvConfig";
import { data, orbisdb } from "./orbisConfig";

type ValidationResult = { valid: true } | { valid: false; error: string };

export async function insertSmartProfile(
    encrypted_profile_data: string,
    scores: string,
    version = '1',
    connectedPlatforms: string,
    profileTypeStreamId: string
) {
    console.log(encrypted_profile_data,
        scores,
        connectedPlatforms,
        version,
        profileTypeStreamId)
    const insertStatement = await orbisdb
        .insert(data.models.smart_profile)
        .value(
            {
                encrypted_profile_data,
                scores,
                connected_platforms: connectedPlatforms,
                version,
                profile_type_stream_id: profileTypeStreamId
            }
        )
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
