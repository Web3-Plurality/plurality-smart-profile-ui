import { combineReducers } from '@reduxjs/toolkit'
import userSessionSlice from '../../Slice/userDataSlice'
import headerSlice from '../../Slice/headerSlice'

export default combineReducers({
    userSession: userSessionSlice,
    header: headerSlice
})