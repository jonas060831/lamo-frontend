import { useAuth } from "./contexts/UserContext"
import LandingPage from "./pages/LandingPage"
import SignInForm from "./shared/forms/signIn/SignInForm"
import Navbar from "./shared/navbar/Navbar"
import { Routes, Route } from 'react-router'

const  App = ()  => {

  const { user } = useAuth()
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={ user ? 'Authed User' : <LandingPage /> }/>

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
