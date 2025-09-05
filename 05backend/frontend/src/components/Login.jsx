import React, {useRef} from "react";
import {Input} from "./index.js"
import {Button} from "./index.js";

function Login(){

    const usernameref = useRef();
    const passwordref = useRef();
    async function login(e){
        e.preventDefault();
        console.log("username: ",usernameref.current.value);
        console.log("password: ",passwordref.current.value);
        const res = await fetch("http://localhost:3000/api/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({username: usernameref.current.value, password: passwordref.current.value})
        });
        const data = await res.text()
        console.log(data);
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
            </form>
        </div>
    )
}

export default Login