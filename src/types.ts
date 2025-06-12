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

export interface SendTransactionData {
    id: string
    from: string
    to: string
    gasFee: number
    amount: number
    nativeCoin: string
    chainAmount: number
    raw_transaction?: string
    chain_id?: string
}

export interface StepState {
    litSigs: string
    isLoading: LoaderData
    userDid: string
    profileConnected: boolean
    currentWalletTab: string
    messageToBeSigned: MesssageSignatureData
    transactionData: SendTransactionData,
    contractData: ContractData | null
    profileDataID: string
    profileSetupData: ProfileSetupData
    surprised: boolean
    iframeToProfiles: boolean
}

export interface ContractData {
    id: string
    type: string
    method: string
    isWidgetOpen: string
    message: string
    signature: string
    address: string
    abi: string
    method_name: string
    method_params: string
    rpc: string
    chain_id: string
    options: string
}
export type TagsRoot = Tags[]

export interface Tags {
  tags: string[]
  category: string
}
