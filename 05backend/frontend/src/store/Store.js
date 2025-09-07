import {configureStore} from "@reduxjs/toolkit"
import AuthSlicereducer from "./Auth.slice.js"
import ChatSlicerreducer from "./Chat.slice.js"

export const store = configureStore({
    reducer: {
        auth: AuthSlicereducer,
        chat: ChatSlicerreducer
    }
})
