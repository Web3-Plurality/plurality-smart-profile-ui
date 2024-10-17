import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '../Slice/headerSlice';
import { RootState } from '../services/store';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.header || initialState;

export const selectShouldUpdate = createSelector(
    [selectDomain],
    (state) => state.shouldUpdate,
);

