## 05backend

[![Watch the video](https://drive.google.com/file/d/1HN3Da4yTzJUFrl2iN3Nm8BXXhK9l-HbO/view?usp=sharing)]



### Overview
A full-stack project with advanced backend (Node.js, Express, MongoDB, WebSockets) and modern frontend (React, Redux, Vite, TailwindCSS).

### Backend Dependencies
- express
- mongoose
- dotenv
- cors
- cookie-parser
- jsonwebtoken
- bcryptjs
- ws
- nodemon (dev)

### Frontend Dependencies
- react
- react-dom
- react-redux
- @reduxjs/toolkit
- react-router-dom
- tailwindcss
- vite

### Backend Install & Run
```sh
cd 05backend/backend
npm install
npm run dev
```

### Frontend Install & Run
```sh
cd 05backend/frontend
npm install
npm run dev
```

### Backend Main Code Sample
```js
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser())
import UserRoute from "./routes/User.route.js";
import RoomRoute from "./routes/Room.route.js";
import MessageRoute from "./routes/Message.route.js";
app.use("/api/v1/user",UserRoute)
app.use("/api/v1/room",RoomRoute)
app.use("/api/v1/message",MessageRoute)
```

### WebSocket Server Sample
```js
import { WebSocketServer } from 'ws'
export default function websocket(server){
	const clients = new Map();
	const wss = new WebSocketServer({server});
	wss.on("connection",(ws)=>{
		ws.on("message",(message)=>{
			const data = JSON.parse(message);
			if(data.type === "join"){
				clients.set(ws,data.room)
			}
			if(data.type === "message"){
				wss.clients.forEach(client=>{
					if(clients.get(client) === data.room){
						client.send(JSON.stringify(data))
					}
				})
			}
		})
	})
}
```

### Explanation (200 words)
05backend is a comprehensive full-stack project. The backend is built with Node.js, Express, MongoDB, and WebSockets, supporting real-time chat and room-based messaging. The codebase is modular, with separate controllers, models, and routes for users, rooms, and messages. The WebSocket server tracks clients and rooms, broadcasting messages to all users in the same room. The frontend uses React, Redux Toolkit, and TailwindCSS, providing a modern, responsive UI. State management is handled with Redux, and routing with React Router. The project demonstrates best practices for scalable, maintainable full-stack development, including environment variable management, error handling, and real-time features. It is suitable for chat apps, collaborative tools, or any project requiring both REST APIs and real-time communication.
---

---

## 04backend

### Overview
A minimal Express and WebSocket backend for real-time communication.

### Dependencies
- express
- ws
- nodemon (dev)

### Install & Run
```sh
cd 04backend
npm install
npm run dev
```

### Main Code Sample
```js
import express from "express"
import { WebSocketServer } from "ws"
const app = express()
const server = app.listen(3000,()=>{ console.log("[*] server is starting....."); })
const wss = new WebSocketServer({server});
wss.on("connection",(wss,req)=>{
	console.log("client connected: ",req.socket.remoteAddress);
	wss.on("message",(data)=>{ console.log("[*] data: ",data.toString()); wss.send("thanku") })
	wss.on("close",()=>console.log("connection closed"))
});
```

### Explanation (200 words)
This project demonstrates how to combine Express with WebSockets for real-time features such as chat or notifications. The server listens for WebSocket connections and can send/receive messages in real time. This is a foundation for building collaborative apps, live dashboards, or multiplayer games. The code is intentionally simple, focusing on the core logic of WebSocket communication. It can be extended to support rooms, authentication, or message broadcasting. Using the `ws` library, it provides a lightweight and efficient solution for real-time web applications.

---


## 03backend

### Overview
A full-featured backend with authentication, user management, and modular architecture. Uses MongoDB, JWT, and various middleware.

### Dependencies
- express
- mongoose
- dotenv
- cors
- cookie-parser
- jsonwebtoken
- bcrypt
- multer
- cloudinary
- mongoose-aggregate-paginate-v2
- nodemon (dev)

### Install & Run
```sh
cd 03backend
npm install
npm run dev
```

### Main Code Sample
```js
import mongoose from 'mongoose';
import {DB_NAME} from './constants.js';
import express from 'express';
import connectDB from './Db/db.js';
import dotenv from "dotenv";
import { app } from './app.js';
dotenv.config();
connectDB()
.then( ()=>{ app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`); }) })
.catch((e =>{ console.error('Database connection error:', e); process.exit(1); }))
```

### Explanation (200 words)
This backend is designed for real-world applications, featuring user authentication, JWT-based sessions, and modular controllers for users, tweets, comments, playlists, and more. It uses MongoDB via Mongoose for data persistence and supports file uploads with Multer and Cloudinary. Middleware for authentication and error handling is included, following best practices for scalable Node.js apps. The codebase is organized into folders for controllers, models, routes, middleware, and utilities, making it easy to maintain and extend. The use of environment variables, async/await, and modern JavaScript features ensures security and performance. This project is suitable for building social platforms, dashboards, or any app requiring robust backend logic and user management.
---

## 02backend

### Overview
A basic Express backend with a simple API for jokes. Demonstrates modular folder structure and API endpoint creation.

### Dependencies
- express

### Install & Run
```sh
cd 02backend/backend
npm install
npm start
```

### Main Code
```js
import express from 'express';
const app = express();
app.get('/',(req,res)=>{ res.send("server is ready"); });
app.get('/api/jokes',(req,res)=>{
	let joks = [ { id:"hahaha" }, { id:"very funny" } ]
	res.send(joks)
})
const port = 4000;
app.listen(port,()=>{ console.log(`server at http://localhost:${port}`); })
```

### Explanation (200 words)
This backend demonstrates a simple API structure using Express with ES modules. The server provides a root endpoint and a `/api/jokes` endpoint that returns a static list of jokes. This setup is useful for prototyping APIs or serving as a mock backend for frontend development. The code is modular and can be easily extended with more endpoints or integrated with a database. The use of ES modules (`import`/`export`) reflects modern JavaScript practices. This project is a good template for small REST APIs and can be used as a foundation for more complex services. The folder structure separates backend and frontend, making it suitable for full-stack applications.
# Backend Monorepo Documentation

This repository contains multiple backend and frontend projects, each demonstrating different architectures, tools, and functionalities. Below is a comprehensive overview of each folder, including dependencies, setup instructions, main features, and code samples.

---

## Table of Contents
- [01backend](#01backend)
- [02backend](#02backend)
- [03backend](#03backend)
- [04backend](#04backend)
- [05backend](#05backend)

---

## 01backend

### Overview
A simple Node.js backend using Express. It demonstrates basic routing and environment variable usage.

### Dependencies
- express
- dotenv

### Install & Run
```sh
cd 01backend
npm install
npm start
```

### Main Code
```js
require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
app.get('/', (req, res) => { res.send('Hello Ankit') })
app.get('/about', (req, res) => { res.send('Ankit works on the backend') })
app.listen(process.env.PORT, () => { console.log(`Example app listening on port ${port}`) })
```

### Explanation (200 words)
This project is a minimal Express server, ideal for learning the basics of Node.js backend development. It uses the `dotenv` package to manage environment variables, allowing configuration such as the port number to be set outside the codebase. The server exposes two routes: `/` returns a simple greeting, and `/about` provides a brief description. This structure is perfect for beginners to understand how HTTP requests are handled in Express, how to structure routes, and how to use middleware. The code is intentionally simple, focusing on clarity and ease of understanding. It can be extended with additional routes, middleware, or connected to a database for more advanced use cases. The use of environment variables is a best practice for managing sensitive data and configuration, making this project a good starting point for more complex applications.
