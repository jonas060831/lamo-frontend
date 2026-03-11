import { useContext } from "react"
import { useAuth } from "./contexts/UserContext"
import SignInForm from "./shared/forms/signIn/SignInForm"
import Navbar from "./shared/navbar/Navbar"
import { Routes, Route } from 'react-router'

const  App = ()  => {

  const { user } = useAuth()
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={ user ? 'Authed Dashboard' : 'Landing Page' }/>

        {
          user ? (
            <>
            </>
          )
          :
          (
            <>
              <Route path="/sign-in" element={ <SignInForm /> } />
            </>
          )
        }
      </Routes>
    </>
  )
}

export default App
