import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/Auth.slice";

function Home(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
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
                console.log(data);
                
                dispatch(loginUser(data.user));
            }
        }
        check();
    },[dispatch])
    return (
        <div className="w-full bg-white text-center">
            <h1>Home page</h1>
        </div>
    )
}

export default Home