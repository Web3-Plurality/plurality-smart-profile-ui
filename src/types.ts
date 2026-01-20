export interface PayloadDataType {
    userId: string
    session: string
    method: string
}

export interface ProfileData {
    id?: number
    iconName?: string
    displayName?: string
    icon?: string
    active?: boolean
    activeIcon?: string
    platformName?: string
    platform?: string
    authentication?: boolean
}

export interface ProfileSetupData {
    parsedName: string
    parsedBio: string
    parsedImage: string | null
}

interface Scores {
    scoreType: string
    scoreValue: number
}
export interface DAppData {
    name: string
    avatar: string
    bio: string
    rating: number
    scores?: Scores[]
    interests?: string[]
    reputationTags?: Scores[]
    collections?: string[]
    badges?: string[]
    consent?: string
    showRoulette: boolean
}

export interface SelectedNetworkType {
    chainId: string,
    token: string,
    chainName: string,
    rpc: string,
    icon: string
}

export interface LoaderData {
    loadingState: boolean,
    text: string
}

export interface MesssageSignatureData {
    message: string
    id: number | null
}

export interface StepState {
    isLoading: LoaderData
    profileConnected: boolean
    messageToBeSigned: MesssageSignatureData
    profileDataID: string
    profileSetupData: ProfileSetupData
    surprised: boolean
    iframeToProfiles: boolean
}
export type TagsRoot = Tags[]

export interface Tags {
  tags: string[]
  category: string
}
