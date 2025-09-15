import React from "react";
import Input from "./Input.jsx";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/Auth.slice.js";

function Roomchat(){
    const [messages,setMessages] = useState([])
    const [users,setUsers] = useState([])
    const [error, setError] = useState("")
    const [openid, setOpenid] = useState("")
    const [followupdate, setFollowupdate] = useState(false)
    const [updatemsgid, setUpdatemsgid] = useState("")
    const chatmessage = useRef()
    const messageref = useRef()
    const ws = useRef(null)
    const {roomid} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state=>state.auth.userData)

    useEffect(()=>{

        //check if the user is logged in
        const check = async ()=>{
            const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/user/checklogin`,{
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

        //get all the messages from the database for the rromid
        const readmessages = async()=>{
            const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/message/read/${roomid}`,{
                method:"GET",
                credentials:"include"
            })
            if(!res.ok){
                const errordata = await res.json().catch(()=>{})
                console.log(errordata);
                setError(errordata.message || "messages cannot be fetched")
            }else{
                const data = await res.json()
                // console.log("[*] messages data",data.data);
                setMessages(data.data)
            }
        }
        readmessages()

        //get users for the roomid [NEED UPDATES FOR BETTER PERFORMANCE]
        const getUsers = async()=>{
            const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/user/getusers`,{
                method:"GET",
                credentials:"include"
            })
            if(!res.ok){
                const errordata = await res.json()
                setError(errordata.message || "users cannot be fetched")
            }else{
                const data = await res.json()
                // console.log("[*] users: ",data.data);
                setUsers(data.data)
            }
        }
        getUsers()

        //start the websocket
        ws.current = new WebSocket(`ws://${import.meta.env.VITE_IP}:3000`)

        //open the connection
        ws.current.onopen = ()=>{
            console.log("[*] setting up the connection");
            ws.current.send(JSON.stringify({type:"join",room:roomid}))
        }

        //Act when a message is recieved
        ws.current.onmessage = (message)=>{
            // console.log("[*] server message: ",message);
            readmessages()
        }

        //close the connection
        ws.current.onclose = () => {
            console.log("Disconnected");
        }

    },[dispatch])

    //get the username who send the messages to the reciever
    const getusername = (id)=>{
        const sender = users.find(user=> user._id === id)
        return sender? sender.name : "undefined"
    }

    //send the message in the chat
    const sendMessage = async()=>{
        const message = messageref.current.value
        messageref.current.value=""
        if (followupdate){
            console.log("msgid=>"+updatemsgid+" text=>"+message);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/message/updatemsg/${updatemsgid}`,{
                method:"PATCH",
                credentials:"include",
                headers:{
                    "Content-Type":"Application/json"
                },
                body: JSON.stringify({text:`${message}: (updated)`})
            })
            if(!res.ok){
                const errordata = await res.json()
                // console.log("[*] message delete error: ",errordata);
                setError(errordata.message || "cannont update message 1")
            }else{
                const data = await res.json()
                // console.log("[*] message delete data: ",data);
                ws.current.send(JSON.stringify({type:"message", text:"", room:roomid}))
            }
            setUpdatemsgid("")
            setFollowupdate(pre=>!pre)
        }else{
            const sendMsg = async()=>{
                const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/message/add/${roomid}`,{
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
                    // console.log("[*] Data: ",data);
                    setMessages(pre=>[...pre,data.data])
                    ws.current.send(JSON.stringify({type:"message",...data.data}))
                }
            }
            sendMsg()
        }
    }

    //close the connection by user
    const connectionClose = ()=>{
        console.log("[*] connection is closed");
        ws.current.close()
        setMessages([])
        navigate("/chat")
    }

    //delete all the messages from the chat for all the user
    const deleteall = async()=>{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/message/deleteall/${roomid}`,{
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

    //delete message
    const deletemsg = async(msgid)=>{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/message/deletemsg/${msgid}`,{
            method:"DELETE",
            credentials:"include"
        })
        if(!res.ok){
            const errordata = await res.json()
            // console.log("[*] message delete error: ",errordata);
            setError(errordata.message || "cannont delete message 1")
        }else{
            const data = await res.json()
            // console.log("[*] message delete data: ",data);
            ws.current.send(JSON.stringify({type:"message", text:"", room:roomid}))
        }
    }

    return(
        <div className="w-full bg-white flex flex-col justify-center items-center my-3">
            <div className="w-full flex flex-col justify-center items-center">
                <table>
                    <tbody>
                        {messages.map(msg=>(
                            <tr key={msg._id}><td onClick={()=>{setOpenid(pre=>(pre===msg._id?null:msg._id))}} className={`text-center pr-3 ${msg.sender !== user.data._id ? "text-red-500":"text-green-500"}`}>{msg.sender !== user.data._id ? `${getusername(msg.sender)}:` : "you:" }
                            {
                                openid === msg._id && msg.sender === user.data._id &&
                                <div className="absolute mt-1 w-28 rounded-md bg-white shadow-lg border z-10">
                                    <button onClick={()=>{deletemsg(msg._id)}} className="rounded-2xl bg-blue-300 px-2 my-2 mr-2">Delete</button>
                                    <button onClick={()=>{messageref.current.value=msg.text; setUpdatemsgid(msg._id); setFollowupdate(pre=>!pre) }} className="rounded-2xl bg-blue-300 px-2 my-2 mr-2">Update</button>
                                </div>
                            }
                            </td>
                            <td>{msg.text}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full bg-white flex flex-col justify-center items-center text-center">
                <p>-------------------------------------------------------------------------</p>
                <Input className="border rounded-2xl text-black px-3" label="Message" type="text" ref={messageref}/>
                {followupdate && 
                    <button onClick={()=>{messageref.current.value=""; setUpdatemsgid(""); setFollowupdate(pre=>!pre) }} className="rounded-2xl bg-blue-300 px-2 my-2">Cancel Update</button>
                }
                <div className="w-full bg-white flex justify-center items-center text-center">
                    <button className="rounded-2xl bg-blue-300 px-2 my-2 mr-2" onClick={sendMessage}>send</button>
                    <button className="rounded-2xl bg-blue-300 px-2 my-2 mr-2" onClick={deleteall}>Clear chat</button>
                </div>
                <div className="w-full bg-white flex justify-center items-center text-center">
                    <button className="rounded-2xl bg-blue-300 px-2 my-2 mr-2" onClick={connectionClose}>close</button>
                    <button className="rounded-2xl bg-blue-300 px-2 my-2" onClick={()=>{connectionClose();navigate("/chat")}}>Go to Rooms</button>
                </div>
            </div>
            <div>
                {error}
            </div>
        </div>
    )
}

export default Roomchat