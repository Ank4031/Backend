import React, {useState, useEffect} from "react";

function Footer(){

    const [data, setdata] = useState("")

    useEffect(()=>{
        fetch("https://api.github.com/users/Ank4031")
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            setdata(data)
        })
    },[])
    return(
        <div className="w-full flex items-center justify-center bg-blue-300 mt-4">
            <div>
                <img className="w-40 h-40 mr-4 rounded-4xl " src={data.avatar_url} alt="img not loded" />
            </div>
            <div className="flex flex-col items-center justify-center bg-blue-300">
                <table>
                    <tbody>
                        <tr>
                            <td className="font-bold">Project Creator:</td>
                            <td className="pl-4">{data.name}</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Github repo:</td>
                            <td className="pl-4">{data.public_repos}</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Github Following:</td>
                            <td className="pl-4">{data.following}</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Github profile:</td>
                            <td className="pl-4"><a href={`${data.html_url}`}>{data.html_url}</a></td>
                        </tr>
                        <tr>
                            <td className="font-bold">Project repo:</td>
                            <td className="pl-4"><a href="https://github.com/Ank4031/Backend/tree/main/05backend">https://github.com/Ank4031/Backend/tree/main/05backend</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Footer