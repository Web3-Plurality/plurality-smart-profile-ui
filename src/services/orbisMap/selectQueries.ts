import axios from "axios";
import { API_BASE_URL } from "../../utils/EnvConfig";
import { ProfileData } from "../../types";
import { socialConnectButtons } from "../../utils/Constants";
import { decryptData } from "../EncryptionDecryption/decryption";

// Add handleLogout as a parameter
export async function selectProfileType(stream_id: string, handleLogout: () => void) {
  const apiUrl = `${API_BASE_URL}/profile-map/profile-types/${stream_id}`;

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
  const apiUrl = `${API_BASE_URL}/profile-map/smart-profiles/by-mapping/${stream_id}/${userId}`;

  try {
    const result = await axios.get(apiUrl);

    if (result.data.newUser) return null;

    const profileData = result.data.data;

    // Decrypt private data if encrypted data is present
    if (profileData.encryptedPrivateData) {
      try {
        const decryptedPrivateData = await decryptData(
          JSON.stringify(profileData.encryptedPrivateData)
        );
        if (decryptedPrivateData) {
          // Clean up: Remove encryption metadata fields if they exist
          const { ciphertext, dataToEncryptHash, ...cleanPrivateData } = decryptedPrivateData;
          // Convert to plain object to avoid merging, then replace privateData with cleaned decrypted version
          const plainProfileData = JSON.parse(JSON.stringify(profileData));
          plainProfileData.privateData = cleanPrivateData;
          // Remove the encrypted data from the profile object
          delete plainProfileData.encryptedPrivateData;
          // Return the plain object with clean decrypted data
          return plainProfileData;
        } else {
          console.warn("Decryption returned null, keeping empty privateData");
        }

        // Remove the encrypted data from the profile object if decryption failed
        delete profileData.encryptedPrivateData;
      } catch (decryptError) {
        console.error("Failed to decrypt private data:", decryptError);
        console.error("Decryption error stack:", decryptError instanceof Error ? decryptError.stack : 'No stack trace');
        // Keep the profile but without privateData if decryption fails
      }
    } else {
      console.log("No encrypted private data found in response");
    }

    return profileData;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleLogout();
    } else {
      console.error("Error selecting smart profiles:", error);
    }
    throw error;
  }
}
