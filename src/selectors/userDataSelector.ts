import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '../Slice/userDataSlice';
import { RootState } from '../services/store';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.userSession || initialState;

export const selectLitSigs = createSelector(
    [selectDomain],
    (state) => state.litSigs,
);

export const selectPublicKey = createSelector(
    [selectDomain],
    (state) => state.publicKey,
);

export const selectLoader = createSelector(
    [selectDomain],
    (state) => state.isLoading,
);

export const selecUserDID = createSelector(
    [selectDomain],
    (state) => state.userDid,
);


