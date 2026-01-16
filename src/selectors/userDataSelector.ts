import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '../Slice/userDataSlice';
import { RootState } from '../services/store';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.userSession || initialState;

export const selectLitSigs = createSelector(
    [selectDomain],
    (state) => state.litSigs,
);

export const selectLoader = createSelector(
    [selectDomain],
    (state) => state.isLoading,
);

export const selectProfileConnected = createSelector(
    [selectDomain],
    (state) => state.profileConnected,
);

export const selectMessageToBeSigned = createSelector(
    [selectDomain],
    (state) => state.messageToBeSigned,
);

export const selectSPDataId = createSelector(
    [selectDomain],
    (state) => state.profileDataID,
);

export const selectProfileSetupData = createSelector(
    [selectDomain],
    (state) => state.profileSetupData,
);

export const selectSurprised = createSelector(
    [selectDomain],
    (state) => state.surprised,
);

export const selectIframeToProfile = createSelector(
    [selectDomain],
    (state) => state.iframeToProfiles,
);

