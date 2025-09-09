import React, { useEffect, useState, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/Auth.slice.js";
import Input from "./Input.jsx";
import { useRef } from "react";

function Chat(){
    const [showchat,setShowchat] = useState(true)
    const [messages,setMessages] = useState([])
    const messageref = useRef()
    const [error, setError] = useState("")
    const [rooms, setRooms] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const ws = useRef(null)

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
                
                dispatch(loginUser(data.user));
            }
        }
        check();


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

    function showChat(id){
        console.log("[*] id: ",id);
        setShowchat(pre=>!pre);

        ws.current = new WebSocket("ws://localhost:3000")

        ws.current.onopen = ()=>{
            console.log("[*] setting up the connection");
        }

        ws.current.onmessage = (event)=>{
            console.log("[*] server message: ",event.data);
            setMessages(pre=>[...pre,`server: ${event.data}`])
        }

        ws.current.onclose = () => {
            console.log("Disconnected");
        }

    }

    const sendMessage = ()=>{
        const message = messageref.current.value
        console.log("[*] typed message: ",message);
        ws.current.send(message)
        setMessages(pre=>[...pre,`you: ${message}`])
    }

    const connectionClose = ()=>{
        console.log("[*] connection is closed");
        ws.current.close()
        setMessages([])
    }

    return (
        <div className="w-full bg-white flex flex-col justify-center items-center">
            {
                showchat && <div className="w-1/3 ">
                    {rooms.map(item=>(
                        <div key={item.name} className="w-full flex justify-center items-center my-3">
                            <div><h2>Join the chat:</h2></div><button onClick={()=>{showChat(item._id)}} className="rounded-l-2xl bg-blue-300 ml-2 px-2">{item.name}</button><button className="rounded-r-2xl bg-red-300 px-2">delete</button>
                        </div>
                    ))}
                </div> 
            }
            {
                !showchat && <div className="w-full bg-white flex flex-col justify-center items-center my-3">
                    <div>
                        <ul>
                            {messages.map(msg=>(
                                <li>{msg}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full bg-white flex flex-col justify-center items-center text-center">
                        <Input className="border rounded-2xl text-black px-3" label="Message" type="text" ref={messageref}/><button className="rounded-2xl bg-blue-300 px-2 my-2" onClick={sendMessage}>send</button>
                        <button className="rounded-2xl bg-blue-300 px-2 my-2" onClick={connectionClose}>close</button>
                        <button className="rounded-2xl bg-blue-300 px-2 my-2" onClick={()=>{setShowchat(pre=>!pre)}}>Go to Rooms</button>
                    </div>
                </div>
            }
            <div>
                {error}
            </div>
        </div>
    )
}

export default Chat