import { combineReducers } from '@reduxjs/toolkit'
import stepperSlice from '../../Slice/stepperSlice'
import userSessionSlice from '../../Slice/userDataSlice'
import headerSlice from '../../Slice/headerSlice'

export default combineReducers({
    stepper: stepperSlice,
    userSession: userSessionSlice,
    header: headerSlice
})