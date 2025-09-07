import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null
}

export const AuthSlice = createSlice({
    name:"chatapp",
    initialState,
    reducers:{
        loginUser: (state,action)=>{
            state.status = true,
            state.userData = action.payload
        },
        logoutUser: (state)=>{
            state.status = false,
            state.userData = null
        }
    }
})

export const {loginUser, logoutUser} = AuthSlice.actions;
export default AuthSlice.reducer;