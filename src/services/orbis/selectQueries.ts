import { ProfileData } from "../../types";
import { socialConnectButtons } from "../../utils/Constants";
import { PLURALITY_CONTEXT } from "../../utils/EnvConfig";
import { data, orbisdb } from "./orbisConfig";

export async function selectProfileType(stream_id: string) {
    try {
      const selectStatement = await orbisdb
        .select()
        .from(data.models.profile_type)
        .where({ stream_id })
        .context(PLURALITY_CONTEXT);
  
      const query = selectStatement.build();
      console.log("Query that will be run", query);
  
      const result = await selectStatement.run();
      const rawPlatforms = result?.rows?.[0]?.platforms;
  
      let fetchedPlatforms: ProfileData[] = [];
      if (rawPlatforms) {
        try {
          fetchedPlatforms = JSON.parse(rawPlatforms);
        } catch (e) {
          console.error("Failed to parse platforms JSON:", rawPlatforms, e);
        }
      }
  
      const neededPlatforms: ProfileData[] = [];
  
      for (const platform of socialConnectButtons) {
        if (fetchedPlatforms.find((x: ProfileData) => x.platform === platform.displayName)) {
          neededPlatforms.push(platform);
        }
      }
  
      const { columns, rows } = result;
      console.log("select first: ", { columns, rows, neededPlatforms });
  
      return { columns, rows, neededPlatforms };
    } catch (error) {
      console.log("Error", error);
    }
  }
  
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