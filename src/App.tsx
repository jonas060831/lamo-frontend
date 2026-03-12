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

        <Route path="/sign-in" element={ <SignInForm /> } />
        {
          user && (
            <>
            </>
          )
        }
      </Routes>
    </>
  )
}

export default App
