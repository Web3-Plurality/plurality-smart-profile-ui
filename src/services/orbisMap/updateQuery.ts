import axios from "axios"
import { API_BASE_URL } from "../../utils/EnvConfig"

export async function updateSmartProfile(
  smartProfile: any,
  stream_id: string,
  token: string,
  handleLogout: () => void
) {
  const apiUrl = `${API_BASE_URL}/orbis-map/smart-profiles/${stream_id}`

  try {
    const result = await axios.put(apiUrl, { ...smartProfile }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    if (!result) return null

    return result.data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleLogout()
    } else {
      console.error("Error updating smart profile:", error)
    }
    throw error
  }
}
