import axios from "axios"
import { API_BASE_URL } from "../../utils/EnvConfig"
import { UsergroupAddOutlined } from "@ant-design/icons"

export async function insertSmartProfile(smartProfile: any, userDid: string) {
    // const sanitizedDid = userDid.replace(/^"|"$/g, '');
    const payload = {
        ...smartProfile,
        userDid
    }
    const apiUrl = `${API_BASE_URL}/orbis-map/smart-profiles`
    const result = await axios.post(apiUrl, {...payload})

    console.log("Result", result)

    return result.data.data
}