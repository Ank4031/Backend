import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/Auth.slice";
import { useNavigate } from "react-router-dom";

function Logout(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    function logout(){
        dispatch(logoutUser());
        navigate("/login")
    }
    return(
        <button onClick={logout}>
            Logout
        </button>
    )
}

export default Logout