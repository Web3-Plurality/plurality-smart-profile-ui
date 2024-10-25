import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '../Slice/stepperSlice';
import { RootState } from '../services/store';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.stepper || initialState;

export const selectCurrentStep = createSelector(
    [selectDomain],
    (state) => state.currentStep,
);

export const selectPreviousStep = createSelector(
    [selectDomain],
    (state) => state.previousStep,
);

export const selectAllSteps = createSelector(
    [selectDomain],
    (state) => state.stepHistory,
);
