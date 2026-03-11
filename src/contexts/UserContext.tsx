import { createContext, useContext, useState, type ReactNode } from "react";
import { getUserFromToken } from "../utils/authHelper";

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
  const [user, setUser] = useState<IUser | null>(getUserFromToken())

  const value: UserContextType = { user, setUser }
  return (
    <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
  )
}

export {
    UserProvider,
    UserContext
}