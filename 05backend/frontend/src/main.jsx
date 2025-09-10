import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import About from './components/About.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import { Provider } from 'react-redux'
import { store } from './store/Store.js'
import Chat from './components/Chat.jsx'
import Roomchat from './components/Roomchat.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path: "",
        element:<Home/>
      },
      {
        path: "about",
        element: <About/>
      },
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "register",
        element: <Register/>
      },
      {
        path: "chat",
        element: <Chat/>
      },
      {
        path: "roomchat/:roomid",
        element: <Roomchat/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
  // <BrowserRouter>
  //   <Routes>
  //     <Route path="/" element={<App/>}>
  //       <Route path="/" element={<Home/>}/>
  //       <Route path="/about" element={<About/>}/>
  //       <Route path="/Login" element={<Login/>}/>
  //     </Route>
  //   </Routes>
  // </BrowserRouter>
)
