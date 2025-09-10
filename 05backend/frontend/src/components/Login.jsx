import React, {useRef, useState} from "react";
import {Input} from "./index.js"
import {Button} from "./index.js";
import {useDispatch, useSelector} from "react-redux"
import { loginUser } from "../store/Auth.slice.js";
import { useNavigate } from "react-router-dom";

function Login(){
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const usernameref = useRef();
    const passwordref = useRef();
    async function login(e){
        e.preventDefault();
        console.log("username: ",usernameref.current.value);//-------------------------------------------->
        const res = await fetch("http://localhost:3000/api/v1/user/login",{
            method:"POST",
            credentials: "include",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({username: usernameref.current.value, password: passwordref.current.value})
        });
        
        console.log("[*] respose: ",res.ok);
        
        if(!res.ok){
            const errordata = await res.json().catch(()=>{});
            console.log(errordata);
            setError(errordata.message || "Something went wrong login-1")
        }else{
            const data = await res.json();
            console.log("[*] user data: ",data); //----------------------------------------------------->
            dispatch(loginUser(data));
            navigate("/")
        }
    }
    return (
        <div className="w-full flex flex-col justify-center items-center bg-white">
            <form onSubmit={login}>
                <div className="w-full">
                    <Input label="Username" type="text" className="border rounded-2xl my-2 px-3" ref={usernameref}/>
                    <Input label="Password" type="text" className="border rounded-2xl my-2 px-3" ref={passwordref}/>
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                    <Button>Submit</Button>
                </div>
                <div>
                    <h2 className="w-full font-bold text-red-500 text-center">{error}</h2>
                </div>
            </form>
        </div>
    )
}

export default Login