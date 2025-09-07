import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    messages: []
}

const ChatSlice = createSlice({
    name:"chat",
    initialState,
    reducers:{
        Addmessage:(state,action)=>{
            state.messages.push(...action.payload)
        },
        Clearmessage:(state)=>{
            state.messages = []
        }
    }
})

export const {Addmessage,Clearmessage} = ChatSlice.actions;
export default ChatSlice.reducer;