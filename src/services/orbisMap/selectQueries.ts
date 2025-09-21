import axios from "axios";
import { API_BASE_URL } from "../../utils/EnvConfig";
import { ProfileData } from "../../types";
import { socialConnectButtons } from "../../utils/Constants";

// Add handleLogout as a parameter
export async function selectProfileType(stream_id: string, handleLogout: () => void) {
  const apiUrl = `${API_BASE_URL}/orbis-map/profile-types/${stream_id}`;

  try {
    const result = await axios.get(apiUrl);
    const rawPlatforms = result.data.data.platforms;

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

    return { profileTypeData: result.data.data, neededPlatforms };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleLogout();
    } else {
      console.error("Error selecting profile type:", error);
    }
    throw error;
  }
}

export async function selectSmartProfiles(
  stream_id: string,
  userId: string,
  handleLogout: () => void
) {
  const apiUrl = `${API_BASE_URL}/orbis-map/smart-profiles/by-mapping/${stream_id}/${userId}`;

  try {
    const result = await axios.get(apiUrl);

    if (result.data.newUser) return null;

    return result.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleLogout();
    } else {
      console.error("Error selecting smart profiles:", error);
    }
    throw error;
  }
}
