import React, {useRef, useState} from "react";
import {Input} from "./index.js"
import {Button} from "./index.js";

function Register(){
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
        const dob = dobref.current.value;
        console.log("username: ",usernameref.current.value);
        
        const res = await fetch("/api/register",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({username, password, name, email, dob})
        });

        if(!res.ok){
            const errordata = await res.json().catch(()=>{});
            setError(errordata || "something went wrong register-1")
        }else{
            const data = await res.text()
            console.log(data);
        }
        
    }
    return (
        <div className="w-full flex flex-col justify-center items-center bg-white">
            <form onSubmit={login}>
                <div className="w-full">
                    <Input label="Name" type="text" className="border rounded-2xl my-2 px-3" ref={nameref}/>
                    <Input label="Userame" type="text" className="border rounded-2xl my-2 px-3" ref={usernameref}/>
                    <Input label="DOB" type="date" className="border rounded-2xl my-2 px-3" ref={dobref}/>
                    <Input label="Email" type="email" className="border rounded-2xl my-2 px-3" ref={emailref}/>
                    <Input label="Password" type="text" className="border rounded-2xl my-2 px-3" ref={passwordref}/>
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                    <Button>Submit</Button>
                </div>
                <div id="errorbox">
                    <h2>{error}</h2>
                </div>
            </form>
        </div>
    )
}

export default Register