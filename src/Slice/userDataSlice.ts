import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { LoaderData, MesssageSignatureData, ProfileSetupData, StepState } from '../types';

export const initialState: StepState = {
    litSigs: '',
    isLoading: {
        loadingState: false,
        text: ''
    },
    profileConnected: false,
    messageToBeSigned: {
        message: '',
        id: null
    },
    profileDataID: '',
    profileSetupData: {
        parsedName: '',
        parsedBio: '',
        parsedImage: null
    },
    surprised: false,
    iframeToProfiles: false,
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
        setProfileConnected: (state) => {
            state.profileConnected = true
        },
        setSignatureMessage: (state, action: PayloadAction<MesssageSignatureData>) => {
            state.messageToBeSigned = action.payload
        },
        setProfileDataID: (state, action: PayloadAction<string>) => {
            state.profileDataID = action.payload
        },
        setProfileSetupData: (state, action: PayloadAction<ProfileSetupData>) => {
            state.profileSetupData = action.payload
        },
        setSurprisedData: (state, action: PayloadAction<boolean>) => {
            state.surprised = action.payload
        },
        setSocialConnectPath: (state, action: PayloadAction<boolean>) => {
            state.iframeToProfiles = action.payload
        }
    },
})

export const {
    globalSessionSigs,
    setLoadingState,
    setProfileConnected,
    setSignatureMessage,
    setProfileDataID,
    setProfileSetupData,
    setSurprisedData,
    setSocialConnectPath
} = UserDataSlice.actions

export default UserDataSlice.reducer