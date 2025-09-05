import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header.jsx'
import { Footer } from './components/index.js'

function App() {
  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App
