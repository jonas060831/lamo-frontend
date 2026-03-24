import { useLocation, Outlet, Navigate } from "react-router"
import { useAuth } from "./contexts/UserContext"


const ProtectedRoute = () => {
  
  const { user } = useAuth()
  const location = useLocation()

  if(!user) return <Navigate to={`/sign-in?redirectUrl=${location.pathname}`} replace />

  return <Outlet />
}

export default ProtectedRoute