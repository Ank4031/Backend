import React from "react";

function About(){
    return (
        <div className="w-full flex flex-col justify-center items-center bg-white text-center p-4">
        <h1 className="text-2xl font-bold mb-4">About page</h1>

        <div className="max-w-3xl text-left">
            <h2 className="text-xl font-semibold mb-2">
            ChatApp – A Real-Time Room-Based Chat Platform
            </h2>
            <p className="mb-4">
            ChatApp, a real-time messaging platform built with the
            MERN stack (MongoDB, Express.js, React, Node.js) and WebSockets (ws). It
            also uses JWT authentication to keep communication secure.
            </p>

            <h3 className="font-semibold mt-4 mb-2">✨ Key Features</h3>
            <ul className="list-disc list-inside space-y-1">
            <li>Login & Registration: Users can create accounts or log in securely using JWT.</li>
            <li>
                Join or Create Rooms:
                <ul className="list-disc list-inside ml-6">
                <li>Join an existing room by entering its name and passcode.</li>
                <li>Create a brand-new room with a chosen name and passcode.</li>
                </ul>
            </li>
            <li>Room Management: View and switch between rooms you’ve joined.</li>
            <li>Real-Time Chat: Messages are sent instantly to all participants via WebSockets.</li>
            <li>
                Message Controls:
                <ul className="list-disc list-inside ml-6">
                <li>Update or delete messages you’ve sent.</li>
                <li>Delete entire chat history for a room (if allowed).</li>
                </ul>
            </li>
            </ul>

            <h3 className="font-semibold mt-6 mb-2">🛠️ Tech Stack</h3>
            <ul className="list-disc list-inside space-y-1">
            <li>Frontend: React + Tailwind CSS</li>
            <li>Backend: Node.js with Express</li>
            <li>Database: MongoDB</li>
            <li>Authentication: JSON Web Tokens</li>
            </ul>
        </div>
        </div>
    )
}

export default About