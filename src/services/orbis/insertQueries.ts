import { PLURALITY_CONTEXT } from "../../utils/EnvConfig";
import { serializeSmartProfile } from "../../utils/Helpers";
import { data, orbisdb } from "./orbisConfig";

type ValidationResult = { valid: true } | { valid: false; error: string };

export async function insertSmartProfile(
    smartProfile: any) {

    await serializeSmartProfile(smartProfile);

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
