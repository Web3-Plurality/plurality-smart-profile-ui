import axios from "axios"
import { API_BASE_URL } from "../../utils/EnvConfig"

// /orbis-map/smart-profiles/{id}
export async function updateSmartProfile(smartProfile: any, stream_id: string) {
    const apiUrl = `${API_BASE_URL}/orbis-map/smart-profiles/${stream_id}`

    const result = await axios.put(apiUrl, {...smartProfile})
  
    console.log("Updation result", result)
  
    if(!result) return null
  
    return result.data.data
  }