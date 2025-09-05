import React from "react";

function Button({children}){
    return(
        <button className="border rounded-2xl px-4 py-2 m-2">
            {children}
        </button>
    )
}

export default Button