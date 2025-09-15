import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/Auth.slice.js";
import { useState } from "react";
import Input from "./Input.jsx";
import { useRef } from "react";

function Home(){
    const [showform,setShowform] = useState(false)
    const [error,setError] = useState("");
    const user = useSelector(state=>state.auth.userData)
    const roomname = useRef();
    const passcode = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        const check = async ()=>{
            // console.log("[*] fetching the data--------------------------->");
            
            const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/user/checklogin`,{
                method:"GET",
                credentials:"include"
            })
            // console.log(res.ok);
            if(!res.ok){
                navigate("/login")
            }else{
                const data = await res.json();
                // console.log(data);
                
                dispatch(loginUser(data));
            }
        }
        check();
    },[dispatch])

    //show form to create a new user
    const showForm = ()=>{
        setShowform(pre=>!pre)
    }
    //submit the details to create the new room
    const submitForm = async(e)=>{
        e.preventDefault();
        const room = roomname.current.value
        const code = passcode.current.value
        const userid = user.data._id
        console.log("[*] form data: room => "+ room+" passocde => "+code+" userid => "+userid);
        const res = await fetch(`http://localhost:3000/api/v1/room/create/${userid}`,{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"Application/json"
            },
            body: JSON.stringify({roomname:room,passcode:code})
        })
        if(!res.ok){
            const errordata = await res.json()
            console.log(errordata);
            setError(errordata.message||"something went wrong in room creation")
        }else{
            const data = await res.json()
            setError(data.message);
        }
    }

    return (
        <div className="w-full flex flex-col justify-center items-center bg-white text-center">
            <h1>Home page</h1>
            <div className="w-full">
                <div className="w-full my-4"><button className="border bg-gray-300 rounded-2xl px-2" onClick={showForm}>Create new Room</button></div>
                <div className="w-full">
                    {
                        showform && <form className="w-full" onSubmit={(e)=>{submitForm(e)}}>
                            <Input label="Room name" type="text" className="border rounded-2xl my-2 px-3" ref={roomname}/>
                            <Input label="Passcode" type="text" className="border rounded-2xl my-2 px-3" ref={passcode}/>
                            <button className="border bg-gray-300 rounded-2xl px-2 mx-2">Create</button>
                            <button className="border bg-gray-300 rounded-2xl px-2" onClick={showForm}>Hide</button>
                        </form>
                    }
                </div>
                <div className="w-full text-center text-red-400">{error}</div>
            </div>
            <div className="w-full">
                <button className="border bg-gray-300 rounded-2xl px-2 my-3" onClick={()=>navigate("/chat")}>Join Chat</button>
            </div>
        </div>
    )
}

export default Home