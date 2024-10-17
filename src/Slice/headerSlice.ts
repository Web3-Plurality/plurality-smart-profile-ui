import { createSlice } from '@reduxjs/toolkit';

interface HeaderState {
    shouldUpdate: boolean
}

export const initialState: HeaderState = {
    shouldUpdate: false
};

const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        updateHeader: (state) => {
            state.shouldUpdate = !state.shouldUpdate;
        },
    },
});

export const { updateHeader } = headerSlice.actions;
export default headerSlice.reducer;