import { useAuth } from "./contexts/UserContext"
import DashboardPage from "./pages/Dashboard"
import LandingPage from "./pages/LandingPage"
import VoiceCommandPage from "./pages/VoiceCommandPage"
import SignInForm from "./shared/forms/signIn/SignInForm"
import Navbar from "./shared/navbar/Navbar"
import { Routes, Route } from 'react-router'

const  App = ()  => {

  const { user } = useAuth()
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={ user ? <DashboardPage /> : <LandingPage /> }/>
        <Route path="/sign-in" element={ <SignInForm /> } />
        {
          user && (
            <>
              <Route path="/voice" element={ <VoiceCommandPage /> } />
            </>
          )
        }
      </Routes>
    </>
  )
}

export default App
