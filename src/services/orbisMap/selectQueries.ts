import axios from "axios";
import { API_BASE_URL } from "../../utils/EnvConfig";
import { ProfileData } from "../../types";
import { socialConnectButtons } from "../../utils/Constants";

export async function selectProfileType(stream_id: string) {
    const apiUrl = `${API_BASE_URL}/orbis-map/profile-types/${stream_id}`
    const result = await axios.get(apiUrl)

    const rawPlatforms = result.data.data.platforms


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

    return {profileTypeData: result.data.data, neededPlatforms}
}

export async function selectSmartProfiles(stream_id: string, userDid: string) {
  const sanitizedDid = userDid.replace(/^"|"$/g, '');
  const apiUrl = `${API_BASE_URL}/orbis-map/smart-profiles/by-mapping/${stream_id}/${sanitizedDid}`
  const result = await axios.get(apiUrl)

  console.log("Resut", result)

  if(!result) return null

  return result.data.data
}