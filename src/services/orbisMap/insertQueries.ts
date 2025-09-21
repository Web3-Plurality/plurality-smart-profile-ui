import axios from "axios"
import { API_BASE_URL } from "../../utils/EnvConfig"

export async function insertSmartProfile(smartProfile: any, token: string,logoutUser: () => void) {
  const payload = { ...smartProfile }
  const apiUrl = `${API_BASE_URL}/orbis-map/smart-profiles`

  try {
    const result = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return result.data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error?.response?.status === 401) {
        logoutUser()
    } else {
      console.error("Error inserting smart profile:", error)
    }
    throw error
  }
}
