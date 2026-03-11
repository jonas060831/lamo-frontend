import { useAuth } from "./contexts/UserContext"
import Navbar from "./shared/navbar/Navbar"
import { Routes, Route } from 'react-router'

const  App = ()  => {

  const { user } = useAuth()
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={ user ? 'Authed Dashboard' : 'Landing Page' }/>
      </Routes>
    </>
  )
}

export default App
