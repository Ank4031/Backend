import React from "react";
import { Link, NavLink } from "react-router-dom";

function Header(){
    return(
        <>
          <div className="w-full flex justify-end bg-blue-300">
            <nav className="w-1/2 flex justify-evenly">
                <NavLink to="/login"
                 className={({isActive})=>(
                    isActive ? "text-white font-bold underline" : "text-black"
                 )}
                >Login</NavLink>
                <NavLink to="/register"
                 className={({isActive})=>(
                    isActive ? "text-white font-bold underline" : "text-black"
                 )}
                >Register</NavLink>
                <NavLink to="/about"
                 className={({isActive})=>(
                    isActive ? "text-white font-bold underline" : "text-black"
                 )}
                >About</NavLink>
            </nav>
          </div>
        </>
    )
}

export default Header
