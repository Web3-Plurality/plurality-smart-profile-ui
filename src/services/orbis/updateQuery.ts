import { orbisdb } from "./orbisConfig";

export async function updateSmartProfile(
    smartProfile: any,
    streamId: string) {
    // Serialize the profile object to required format
    smartProfile.scores = JSON.stringify(smartProfile.scores), 
    smartProfile.connectedPlatforms = JSON.stringify(smartProfile.connectedPlatforms), 
    smartProfile.extendedPublicData = JSON.stringify(smartProfile.extendedPublicData),
    smartProfile.attestation = JSON.stringify(smartProfile.attestation),
    smartProfile.privateData = JSON.stringify(smartProfile.privateData)
    
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