import { serializeSmartProfile } from "../../utils/Helpers";
import { orbisdb } from "./orbisConfig";

export async function updateSmartProfile(
    smartProfile: any,
    streamId: string) {

    await serializeSmartProfile(smartProfile);
    
    // update    
    const updateStatement = await orbisdb
        .update(streamId)
        .set(smartProfile)

    try {
        const result = await updateStatement.run();
        console.log(result);
        return result
    }
    catch (error) {
        console.log(error);
    }
}