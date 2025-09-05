import React from "react";

const Input = React.forwardRef(function Input({
    label,
    type="text",
    ...props
},ref){
    return(
        <div className="w-full">
            <div>
                {label && <label
                    >
                        {label}
                    </label>
                }
            </div>
            <div>
                <input ref={ref} type={type} placeholder={label} {...props} required/>
            </div>
        </div>
    )
})


export default Input