import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ContractData, LoaderData, MesssageSignatureData, SendTransactionData, StepState } from '../types';

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
    },
    contractData: null,
    profileDataID: '',
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
        },
        setContractData: (state, action: PayloadAction<ContractData>) => {
            state.contractData = action.payload
        },
        setProfileDataID: (state, action: PayloadAction<string>) => {
            state.profileDataID = action.payload
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
    setTransactionData,
    setContractData,
    setProfileDataID
} = UserDataSlice.actions

export default UserDataSlice.reducer