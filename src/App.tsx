import { useAuth } from "./contexts/UserContext"
import DashboardPage from "./pages/Dashboard"
import LandingPage from "./pages/LandingPage"
import NotFoundPage from "./pages/NotFoundPage"
import PureTextPage from "./pages/PureTextPage"
import ReceiptTrackerPage from "./pages/ReceiptTrackerPage"
import VoiceCommandPage from "./pages/VoiceCommandPage"
import ProtectedRoute from "./ProtectedRoute"
import SignInForm from "./shared/forms/signIn/SignInForm"
import Navbar from "./shared/navbar/Navbar"
import { Routes, Route } from 'react-router'

const  App = ()  => {

  const { user } = useAuth()
  
  return (
    <>
      <Navbar />
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={ user ? <DashboardPage /> : <LandingPage /> }/>
        <Route path="/sign-in" element={ <SignInForm /> } />

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />} >
          <Route path="/voice" element={ <VoiceCommandPage /> } />
          <Route path="/pure-text" element={ <PureTextPage /> } />
          <Route path="/receipt-tracker" element={ <ReceiptTrackerPage /> }/>
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />}/>

      </Routes>
    </>
  )
}

export default App
