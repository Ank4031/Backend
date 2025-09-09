import React, { useEffect, useState, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Input} from "./index.js";
import { Addmessage } from "../store/Chat.slice.js";

function Chat(){
    const [error, setError] = useState("")
    const [rooms, setRooms] = useState([])
    const dispatch = useDispatch()

    useEffect(()=>{
        const getrooms = async ()=>{
            const res = await fetch("http://localhost:3000/api/v1/room/getrooms",{
                method:"GET",
                credentials:"include"
            })
            if(!res.ok){
                const errordata = await res.json()
                console.log(errordata);
                setError(errordata.message)
            }else{
                const data = await res.json()
                console.log(data.data);
                setRooms(data.data)
            }
        }
        getrooms()
    },[])

    return (
        <div className="w-full bg-white flex flex-col justify-center items-center">
            <div className="w-1/3 ">
                {rooms.map(item=>(
                    <div key={item.name} className="w-full flex justify-center items-center my-3">
                        <div><h2>Join the chat:</h2></div><button className="rounded-l-2xl bg-blue-300 ml-2 px-2">{item.name}</button><button className="rounded-r-2xl bg-red-300 px-2">delete</button>
                    </div>
                ))}
            </div>
            <div>
                {error}
            </div>
        </div>
    )
}

export default Chat