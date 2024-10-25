import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StepState {
    stepHistory: string[];
    currentStep: string;
    previousStep: string;
}

export const initialState: StepState = {
    stepHistory: ['home'],
    currentStep: 'home',
    previousStep: ''
};

const stepperSlice = createSlice({
    name: 'stepper',
    initialState,
    reducers: {
        goToStep: (state, action: PayloadAction<string>) => {
            state.previousStep = state.currentStep;
            state.currentStep = action.payload;

            const stepSet = new Set(state.stepHistory);
            stepSet.add(action.payload);
            state.stepHistory = Array.from(stepSet);
        },
        goBack: (state) => {
            if (state.stepHistory.length > 1) {
                state.previousStep = state.currentStep;
                state.stepHistory.pop();
                state.currentStep = state.stepHistory[state.stepHistory.length - 1];
            }
        },
        resetSteps: (state) => {
            state.stepHistory = ['home'];
            state.currentStep = 'home';
            state.previousStep = '';
        },
    },
});

export const { goToStep, goBack, resetSteps } = stepperSlice.actions;

export default stepperSlice.reducer;
