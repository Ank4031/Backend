import React from "react";
import Input from "./Input.jsx";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/Auth.slice.js";

function Roomchat(){
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
            const res = await fetch("http://localhost:3000/api/v1/user/checklogin",{
                method:"GET",
                credentials:"include"
            })
            // console.log(res.ok);
            if(!res.ok){
                navigate("/login")
            }else{
                const data = await res.json();
                dispatch(loginUser(data));
            }
        }
        check();


        console.log("[*] id: ",roomid);

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
            }
        }
        readmessages()

        ws.current = new WebSocket("ws://localhost:3000")

        ws.current.onopen = ()=>{
            console.log("[*] setting up the connection");
            ws.current.send(JSON.stringify({type:"join",room:roomid}))
        }

        ws.current.onmessage = (message)=>{
            console.log("[*] server message: ",message);
            readmessages()
        }

        ws.current.onclose = () => {
            console.log("Disconnected");
        }

    },[dispatch])

    const sendMessage = ()=>{
        const message = messageref.current.value
        messageref.current.value=""
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
                ws.current.send(JSON.stringify({type:"message",...data.data}))
            }
        }
        sendMsg()
    }

    const connectionClose = ()=>{
        console.log("[*] connection is closed");
        ws.current.close()
        setMessages([])
        navigate("/chat")
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
            ws.current.send(JSON.stringify({type:"message", text:"", room:roomid}))
        }
    }

    return(
        <div className="w-full bg-white flex flex-col justify-center items-center my-3">
            <div className="w-full flex flex-col justify-center items-center">
                <table className="w-1/3 justify-center items-center">
                    {messages.map(msg=>(
                        <tr className=""><td className={`${msg.sender !== user.data._id ? "text-red-500":"text-green-500"}`}>{msg.sender !== user.data._id ? "sender:" : "you:" }</td><td>{msg.text}</td></tr>
                    ))}
                </table>
            </div>
            <div className="w-full bg-white flex flex-col justify-center items-center text-center">
                <p>-------------------------------------------------------------------------</p>
                <Input className="border rounded-2xl text-black px-3" label="Message" type="text" ref={messageref}/>
                <div className="w-full bg-white flex justify-center items-center text-center">
                    <button className="rounded-2xl bg-blue-300 px-2 my-2 mr-2" onClick={sendMessage}>send</button>
                    <button className="rounded-2xl bg-blue-300 px-2 my-2 mr-2" onClick={deleteall}>delete all</button>
                    <button className="rounded-2xl bg-blue-300 px-2 my-2" onClick={connectionClose}>close</button>
                </div>
                <div className="w-full bg-white flex justify-center items-center text-center">
                    <button className="rounded-2xl bg-blue-300 px-2 my-2" onClick={()=>{navigate("/chat")}}>Go to Rooms</button>
                </div>
            </div>
            <div>
                {error}
            </div>
        </div>
    )
}

export default Roomchat