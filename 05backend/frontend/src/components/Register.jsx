import React, {useRef, useState} from "react";
import {Input} from "./index.js"
import {Button} from "./index.js";
import { useNavigate } from "react-router-dom";

function Register(){
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const usernameref = useRef();
    const passwordref = useRef();
    const nameref = useRef();
    const emailref = useRef();
    const dobref = useRef();
    async function login(e){
        e.preventDefault();
        const username = usernameref.current.value;
        const password = passwordref.current.value;
        const name = nameref.current.value;
        const email = emailref.current.value;
        console.log("username: ",usernameref.current.value);
        
        const res = await fetch("http://localhost:3000/api/v1/user/register",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({username, password, name, email})
        });

        if(!res.ok){
            const errordata = await res.json().catch(()=>{});
            console.log(errordata);
            setError(errordata.message || "something went wrong register-1")
        }else{
            const data = await res.json()
            console.log(data);
            navigate("/login")
        }
    }
    return (
        <div className="w-full flex flex-col justify-center items-center bg-white">
            <form onSubmit={login}>
                <div className="w-full">
                    <Input label="Name" type="text" className="border rounded-2xl my-2 px-3" ref={nameref}/>
                    <Input label="Userame" type="text" className="border rounded-2xl my-2 px-3" ref={usernameref}/>
                    <Input label="Email" type="email" className="border rounded-2xl my-2 px-3" ref={emailref}/>
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

export default Register