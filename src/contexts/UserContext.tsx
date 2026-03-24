import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getUserFromToken } from "../utils/authHelper";
import { useLocation, useNavigate } from "react-router";
import DismissModal from "../shared/uis/informational/modals/DismissModal";

export interface IUser  {
    username: string
    _id: string
}

export type UserContextType = {
    user: IUser | null
    setUser: (value: IUser | null) => void
}

const UserContext = createContext<UserContextType | null>(null)

export const useAuth = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useAuth must be used within UserProvider")
  return context
}

const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const { pathname }= useLocation()
  const [user, setUser] = useState<IUser | null>(getUserFromToken())
  const [ isSessionExpired, setIsSessionExpired ] = useState(false)
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  
  const clearUser = () => {
    setUser(null)
    localStorage.removeItem('token')
  }
  //check if token is expired every second
  useEffect(() => {

    const interval = setInterval(() => {
      const token = localStorage.getItem('token')
      
      if(!token) return

      try {
        const parsedToken = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Math.floor(Date.now() / 1000)

        if(parsedToken.exp === undefined || parsedToken.exp < currentTime) {
          setIsSessionExpired(true)
          setIsModalOpen(true)
        }
        

      } catch (error) {
        const errMessage = error instanceof Error ? error.message : 'Token Error'
        console.error('Token parse error: ', errMessage)
      }

    }, 1000)

    return () => clearInterval(interval)

  }, [])

  const value: UserContextType = { user, setUser }


  return (
    <UserContext.Provider value={value}>
        {children}

        { isSessionExpired && (
          <DismissModal
           title="Session Expired"
           isOpen={isModalOpen}
           onClose={() => {
            setIsModalOpen(false)
            clearUser()
            navigate(`/sign-in?redirectUrl=${pathname}`)
           }}
           buttonTitle="Ok"
          >
            <h3>Please Login</h3>
          </DismissModal>
        )}
    </UserContext.Provider>
  )
}

export {
    UserProvider,
    UserContext
}