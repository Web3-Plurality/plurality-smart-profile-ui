import { ProfileData } from "../../types";
import { socialConnectButtons } from "../../utils/Constants";
import { PLURALITY_CONTEXT } from "../../utils/EnvConfig";
import { data, orbisdb } from "./orbisConfig";

export async function selectProfileType(stream_id: string) {
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
        const fetchedPlatforms: ProfileData[] = JSON.parse(result.rows[0].platforms)
        const neededPlatforms: ProfileData[] = []
        // set platforms this workflow needs
        for (const platform of socialConnectButtons) {
            // in order to minimize the changes, we use the contant as our maximal platforms, and we iterate over it based on the platforms we fetched from orbis
            if (fetchedPlatforms.find((x: ProfileData) => x.platform === platform.displayName)) {
                neededPlatforms.push(platform)
            }
        }

        const { columns, rows } = result
        console.log("select first: ", { columns, rows, neededPlatforms });
        return { columns, rows, neededPlatforms };
    }
    catch (error) {
        console.log("Error", error)
    }
}

// export async function selectProfileType() {
//     try {
//         const selectStatement = await orbisdb
//             .select()
//             .from(data.models.profile_type)
//             .where({
//                 stream_id: PROFILE_TYPE_STREAM_ID
//             })
//             .context(PLURALITY_CONTEXT)

//         const result = await selectStatement.run();
//         const { columns, rows } = result
//         return { columns, rows };
//     }
//     catch (error) {
//         console.log("Error", error)
//     }
// }
export async function selectSmartProfiles(stream_id: string, userDid: string) {
    try {

        if (userDid) {
            const selectStatement = await orbisdb
                .select()
                .from(data.models.smart_profile)
                .where({
                    profileTypeStreamId: stream_id,
                    controller: JSON.parse(userDid) || ''
                })
                .orderBy(["indexed_at", "desc"])
                .context(PLURALITY_CONTEXT)

            const query = selectStatement.build()
            console.log("Query that will be run", query)
            const result = await selectStatement.run();
            console.log(result);
            const { columns, rows } = result
            return { columns, rows };
        }

    }
    catch (error) {
        console.log("Error", error)
    }
}