import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


interface LoaderData {
    loadingState: boolean,
    text: string
}

interface StepState {
    litSigs: string
    isLoading: LoaderData
    userDid: string
}

export const initialState: StepState = {
    litSigs: '',
    isLoading: {
        loadingState: false,
        text: ''
    },
    userDid: ''
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
    },
})

export const {
    globalSessionSigs,
    setLoadingState,
    setUserDID
} = UserDataSlice.actions

export default UserDataSlice.reducer