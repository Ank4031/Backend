import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/Auth.slice";
import { useNavigate } from "react-router-dom";

function Logout(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logout = async()=>{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/user/logout`,{
            method:"POST",
            credentials:"include"
        })
        if(!res.ok){
            const errordata = await res.json()
            console.log("[*] login error",errordata);
        }else{
            const data = await res.json()
            console.log("[*] logged out ",data);
            dispatch(logoutUser());
            navigate("/login")
        }
    }
    return(
        <button onClick={logout}>
            Logout
        </button>
    )
}

export default Logout