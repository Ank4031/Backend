import React from "react";
import Input from "./Input.jsx";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/Auth.slice.js";

function Roomchat(){
    const [showchat,setShowchat] = useState(true)
    const [messages,setMessages] = useState([])
    const [error, setError] = useState("")
    const messageref = useRef()
    const ws = useRef(null)
    const {roomid} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state=>state.auth.userData)

    useEffect(()=>{

        const check = async ()=>{
            console.log("[*] fetching the data--------------------------->");
            
            const res = await fetch("http://localhost:3000/api/v1/user/checklogin",{
                method:"GET",
                credentials:"include"
            })
            console.log(res.ok);
            if(!res.ok){
                navigate("/login")
            }else{
                const data = await res.json();
                console.log(data);
                dispatch(loginUser(data));
            }
        }
        check();


        console.log("[*] id: ",roomid);
        setShowchat(pre=>!pre);

        const readmessages = async()=>{
            const res = await fetch(`http://localhost:3000/api/v1/message/read/${roomid}`,{
                method:"GET",
                credentials:"include"
            })
            if(!res.ok){
                const errordata = await res.json().catch(()=>{})
                console.log(errordata);
                setError(errordata.message || "messages cannot be fetched")
            }else{
                const data = await res.json()
                console.log("[*] messages data",data.data);
                setMessages(data.data)
                console.log('[*] messages: ',messages);
                
            }
        }
        readmessages()

        ws.current = new WebSocket("ws://localhost:3000")

        ws.current.onopen = ()=>{
            console.log("[*] setting up the connection");
        }

        ws.current.onmessage = (event)=>{
            console.log("[*] server message: ",event.data);
            readmessages()
        }

        ws.current.onclose = () => {
            console.log("Disconnected");
        }

    },[dispatch])

    const sendMessage = ()=>{
        const message = messageref.current.value
        console.log("[*] typed message: ",message);
        ws.current.send(message)
        console.log("[*] sender: ",user.data);
        const sendMsg = async()=>{
            const res = await fetch(`http://localhost:3000/api/v1/message/add/${roomid}`,{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({message, userid:user.data._id})
            })
            if(!res.ok){
                const errordata= await res.json()
                console.log("[*] error: ",errordata);
                setError(errordata.message)
            }else{
                const data= await res.json()
                console.log("[*] Data: ",data);
                setMessages(pre=>[...pre,data.data])
            }
        }
        sendMsg()
    }

    const connectionClose = ()=>{
        console.log("[*] connection is closed");
        ws.current.close()
        setMessages([])
    }

    const deleteall = async()=>{
        const res = await fetch(`http://localhost:3000/api/v1/message/deleteall/${roomid}`,{
            method:"DELETE",
            credentials:"include"
        })
        if(!res.ok){
            const errordata = await res.json()
            console.log(errordata);
            setError(errordata.message || "cannot delete the messages")
        }else{
            setMessages([])
            console.log("all messages deleted");
        }
    }

    return(
        <div className="w-full bg-white flex flex-col justify-center items-center my-3">
            <div className="w-full flex flex-col justify-center items-center">
                <ul className="w-1/3 flex flex-col justify-center items-center">
                    {messages.map(msg=>(
                        <li className="w-full flex justify-center items-center"><p className={`mr-2 ${msg.sender !== user.data._id ? "text-red-500":"text-green-500"}`}>{msg.sender !== user.data._id ? "sender:" : "you:" }</p><p>{msg.text}</p></li>
                    ))}
                </ul>
            </div>
            <div className="w-full bg-white flex flex-col justify-center items-center text-center">
                <Input className="border rounded-2xl text-black px-3" label="Message" type="text" ref={messageref}/><button className="rounded-2xl bg-blue-300 px-2 my-2" onClick={sendMessage}>send</button>
                <button className="rounded-2xl bg-blue-300 px-2 my-2" onClick={connectionClose}>close</button>
                <button className="rounded-2xl bg-blue-300 px-2 my-2" onClick={()=>{navigate("/chat")}}>Go to Rooms</button>
                <button className="rounded-2xl bg-blue-300 px-2 my-2" onClick={deleteall}>delete all</button>
            </div>
            <div>
                {error}
            </div>
        </div>
    )
}

export default Roomchat