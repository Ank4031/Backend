import React, { useEffect, useState, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Input} from "./index.js";
import { Addmessage } from "../store/Chat.slice.js";

function Chat(){
    const messages = useSelector(state=>state.chat.messages)
    const token = useSelector(state=>state.auth.userData?.token)
    const [error, setError] = useState("")
    const dispatch = useDispatch()

    useEffect(()=>{
        const fetchmessages = async () =>{
            const res = await fetch("/api/chat",{
                method:"GET",
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })
            if(!res.ok){
                const dataError = await res.json().catch(()=>{})
                setError(dataError?.message || "something is wrong in chat-1")
            }else{
                const data = await res.json()
                console.log("[*] data: ",data);
                dispatch(Addmessage(data))
            }
        }
        fetchmessages()
    },[dispatch, token])
    return (
        <div className="w-full bg-white text-center">
            <div>
                <ul>
                    {messages.map(item=>(
                        <li key={item.id}>{item.text}</li>
                    ))}
                </ul>
            </div>
            <div>
                <Input label="message" type="text" className="border rounded-2xl my-2 px-3"/>
                <button type="text" className="border rounded-2xl my-2 px-3">send</button>
            </div>
            <div>
                {error}
            </div>
        </div>
    )
}

export default Chat