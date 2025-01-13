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
    consent?: boolean
}

export interface SelectedNetworkType {
    chainId: string,
    token: string,
    chainName: string,
    rpc: string,
    icon: string
}