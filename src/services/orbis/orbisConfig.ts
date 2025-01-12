import { OrbisDB } from "@useorbis/db-sdk";
import {
    CERAMIC_URL,
    ORBIS_ENV, ORBIS_NODE_URL,
    PLURALITY_CONTEXT,
    PROFILE_TYPE_MODEL,
    SMART_PROFILE_MODEL
} from "../../utils/EnvConfig";

const orbisdb = new OrbisDB({
    ceramic: { gateway: CERAMIC_URL },
    nodes: [{ gateway: ORBIS_NODE_URL, env: ORBIS_ENV }]
})

const data = {
    contexts: { plurality: PLURALITY_CONTEXT },
    models: {
        smart_profile: SMART_PROFILE_MODEL,
        profile_type: PROFILE_TYPE_MODEL
    }
}

export {
    orbisdb,
    data
}