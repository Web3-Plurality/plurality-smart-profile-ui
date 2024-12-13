import { orbisdb } from "./orbisConfig";

export async function updateSmartProfile(
    encrypted_profile_data: string,
    scores: string,
    version = '1',
    connectedPlatforms: string,
    stream_id: string) {
    // This will replace the provided row with provided values
    const updateStatement = await orbisdb
        .update(stream_id)
        .set(
            {
                encrypted_profile_data,
                scores,
                connected_platforms: connectedPlatforms,
                version,
            }
        )

    try {
        const result = await updateStatement.run();
        console.log(result);
        return result
    }
    catch (error) {
        console.log(error);
    }
}