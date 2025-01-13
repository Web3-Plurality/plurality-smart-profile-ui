import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


interface LoaderData {
    loadingState: boolean,
    text: string
}

interface MesssageSignatureData {
    message: string
    id: number | null
}

interface SendTransactionData {
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

interface StepState {
    litSigs: string
    isLoading: LoaderData
    userDid: string
    profileConnected: boolean
    currentWalletTab: string
    messageToBeSigned: MesssageSignatureData
    transactionData: SendTransactionData
}

export const initialState: StepState = {
    litSigs: '',
    isLoading: {
        loadingState: false,
        text: ''
    },
    userDid: '',
    profileConnected: false,
    currentWalletTab: 'balance',
    messageToBeSigned: {
        message: '',
        id: null
    },
    transactionData: {
        id: '',
        from: '',
        to: '',
        gasFee: 0,
        amount: 0,
        nativeCoin: '',
        chainAmount: 0
    }
};

export const UserDataSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        globalSessionSigs: (state, action: PayloadAction<string>) => {
            state.litSigs = action.payload
        },
        setLoadingState: (state, action: PayloadAction<LoaderData>) => {
            const { loadingState, text } = action.payload
            state.isLoading.loadingState = loadingState
            state.isLoading.text = text
        },
        setUserDID: (state, action: PayloadAction<string>) => {
            state.userDid = action.payload
        },
        setProfileConnected: (state) => {
            state.profileConnected = true
        },
        setWalletTab: (state, action: PayloadAction<string>) => {
            state.currentWalletTab = action.payload
        },
        setSignatureMessage: (state, action: PayloadAction<MesssageSignatureData>) => {
            state.messageToBeSigned = action.payload
        },
        setTransactionData: (state, action: PayloadAction<SendTransactionData>) => {
            state.transactionData = action.payload
        }
    },
})

export const {
    globalSessionSigs,
    setLoadingState,
    setUserDID,
    setProfileConnected,
    setWalletTab,
    setSignatureMessage,
    setTransactionData
} = UserDataSlice.actions

export default UserDataSlice.reducer