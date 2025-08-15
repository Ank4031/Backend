import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react'


function App() {
  const [jokes, setjokes] = useState([])
  
  useEffect(()=>{
    axios.get('/api/jokes')
    .then((res)=>{
      console.log(res);
      setjokes(res.data)
    })
    .catch((e)=>{
      console.log(e);
    })
  },[])

  return (
    <>
      <h1>full stack by ankit</h1>
      <p>jokes:{jokes.length}</p>
      {
        jokes.map((joke,idex)=>(
          <div key={joke.id}>
            <h3>{joke.id}</h3>
          </div>
        ))
      }
    </>
  )
}

export default App
