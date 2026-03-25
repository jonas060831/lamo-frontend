import { useLocation, Outlet, Navigate } from "react-router"
import { useAuth } from "./contexts/UserContext"


const ProtectedRoute = () => {
  
  const { user } = useAuth()
  const location = useLocation()

  //detect logout navigation

  if(!user) {
    return (
      <Navigate
       to="/sign-in"
       state={{ from: location.pathname }}
       replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute