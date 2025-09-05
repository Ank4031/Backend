import React, {useRef} from "react";
import {Input} from "./index.js"
import {Button} from "./index.js";

function Register(){
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
        const email = usernameref.current.value;
        const dob = dobref.current.value;
        console.log("username: ",usernameref.current.value);
        const res = await fetch("http://localhost:3000/api/register",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({username, password, name, email, dob})
        });
        const data = await res.text()
        console.log(data);
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
            </form>
        </div>
    )
}

export default Register