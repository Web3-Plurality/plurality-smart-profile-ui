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

export const selecUserDID = createSelector(
    [selectDomain],
    (state) => state.userDid,
);

export const selectProfileConnected = createSelector(
    [selectDomain],
    (state) => state.profileConnected,
);

export const selectCurrentWalletTab = createSelector(
    [selectDomain],
    (state) => state.currentWalletTab,
);

export const selectMessageToBeSigned = createSelector(
    [selectDomain],
    (state) => state.messageToBeSigned,
);

export const selectTransactionData = createSelector(
    [selectDomain],
    (state) => state.transactionData,
);

export const selectContratData = createSelector(
    [selectDomain],
    (state) => state.contractData,
);


export const selectSPDataId = createSelector(
    [selectDomain],
    (state) => state.profileDataID,
);

