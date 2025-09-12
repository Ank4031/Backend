import React, { useEffect, useState, useId, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/Auth.slice.js";
import Input from "./Input.jsx";


function Chat(){
    const [error, setError] = useState("")
    const [rooms, setRooms] = useState([])
    const [showform, setShowform] = useState(false)
    const passcode = useRef()
    const roomname = useRef()
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
                // console.log("[*] rooms: ",data.data);
                setRooms(data.data)
            }
        }
        getrooms();
    },[dispatch,error])

    //open the room to start chat
    const openRoom = (roomid)=>{
        // console.log("[*] roomid: ",roomid);
        
        navigate(`/roomchat/${roomid}`)
    }
    //join a new room
    const joinroom = async(e)=>{
        e.preventDefault()
        const code = passcode.current.value
        const name = roomname.current.value
        console.log("[*] code=>"+code+" name=>"+name);
        const res = await fetch("http://localhost:3000/api/v1/room/joinroom",{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"Application/json"
            },
            body: JSON.stringify({roomname:name, passcode:code})
        })
        if(!res.ok){
            const errordata = await res.json()
            setError(errordata.message || "cannot join room 1")
        }else{
            const data = await res.json()
            setError(data.message)
            setShowform(pre=>!pre)
        }
    }
    //delete the room for the user if not the creator of the room else delete the room for all of the users
    const deleteroom = async(id)=>{
        // console.log("[*] room id: ",id);
        
        const res = await fetch(`http://localhost:3000/api/v1/room/delete/${id}`,{
            method:"DELETE",
            credentials:"include"
        })
        if(!res.ok){
            const errordata = await res.json()
            setError(errordata.message)
        }else{
            const data = await res.json()
            setError(data.message)
        }
    }

    return (
        <div className="w-full bg-white flex flex-col justify-center items-center">
            <div className="w-full bg-white flex flex-col justify-center items-center">
                <button onClick={()=>{setShowform(pre=>!pre)}} className="bg-blue-300 rounded-2xl px-2 my-3">Join new Room</button>
            </div>
            {
                showform && <form onSubmit={(e)=>{joinroom(e)}}>
                    <Input label="Room Name" type="text" className="border rounded-2xl my-2 px-3" ref={roomname}/>
                    <Input label="Passcode" type="text" className="border rounded-2xl my-2 px-3" ref={passcode}/>
                    <div className="w-full bg-white flex flex-col justify-center items-center">
                        <button className="bg-blue-300 rounded-2xl px-2 my-3">Join Room</button>
                    </div>
                </form>
            }
            <div className="w-1/3 ">
                {rooms.map(item=>(
                    <div key={item.name} className="w-full flex justify-center items-center my-3">
                        <div><h2>Join the chat:</h2></div><button onClick={()=>{openRoom(item.room)}} className="rounded-l-2xl bg-blue-300 ml-2 px-2">{item.name}</button><button onClick={()=>{deleteroom(item.room)}} className="rounded-r-2xl bg-red-300 px-2">delete</button>
                    </div>
                ))}
            </div> 
            <div className="text-red-500">
                {error}
            </div>
        </div>
    )
}

export default Chat