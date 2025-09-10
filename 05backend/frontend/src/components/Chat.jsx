import React, { useEffect, useState, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/Auth.slice.js";


function Chat(){
    const [error, setError] = useState("")
    const [rooms, setRooms] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
                console.log("[*] checked user: ",data);
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
                console.log(data.data);
                setRooms(data.data)
            }
        }
        getrooms()
    },[dispatch])

    const openRoom = (roomid)=>{
        navigate(`/roomchat/${roomid}`)
    }


    return (
        <div className="w-full bg-white flex flex-col justify-center items-center">
            <div className="w-1/3 ">
                {rooms.map(item=>(
                    <div key={item.name} className="w-full flex justify-center items-center my-3">
                        <div><h2>Join the chat:</h2></div><button onClick={()=>{openRoom(item._id)}} className="rounded-l-2xl bg-blue-300 ml-2 px-2">{item.name}</button><button className="rounded-r-2xl bg-red-300 px-2">delete</button>
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