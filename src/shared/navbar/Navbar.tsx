import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

import Menu from '../../assets/svgs/menu.svg'
import lightIcon from '../../assets/svgs/sun.svg'
import darkIcon from '../../assets/svgs/moon.svg'

import useTheme from "../../hooks/useTheme";
import { useAuth, type IUser } from "../../contexts/UserContext";

import * as authService from '../../services/authService'
import PillButton from "../uis/Buttons/PillButton/PillButton";
import { useNavigate } from "react-router";
import LinkButton from "../uis/Buttons/LinkButton/LinkButton";



interface IProfile extends IUser {
  avatarImg: string
  firstName?: string
  lastName?: string
}
export default function Navbar() {

  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState< IProfile | null>(null)

  const { theme, toggleTheme } = useTheme()


  const { user, clearUser } = useAuth()


  const handleDismiss = () => setOpen(false)

  useEffect(() => {

    const getProfile = async () => {

      try {
        const { userInfo } = await authService.myProfile()
        setProfile(userInfo)

      } catch (error) {
        const errMessage = error instanceof Error ? error.message : 'Server Error'
        console.log(errMessage)
      }
    }

    //get profile only if there is an existing user this prevents null value on localStorage
    if(user) getProfile()

  }, [user])
 
  // lock scrolling when navbar is open
  useEffect(() => {

    if(open) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    }
    else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [open])

  const handleSignIn = () => {
    navigate('/sign-in')
    handleDismiss()
  }

  const handleSignOut = async () => {

    navigate("/", { replace: true }) //TODO:RACE CONDITION HACK FOR NOW
    setTimeout(() => {
      setProfile(null)
      handleDismiss()
      clearUser()
      navigate("/sign-in")
    }, 50)
  }

  return (
    <>
      <nav className={styles.navbar}>
        <button
          className={styles.menuButton}
          onClick={() => setOpen(true)}
          aria-label="menu"
        >
          <img 
           className={`svg ${styles.menuImg}`}
           src={Menu}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, display: 'block' }}
              exit={{ opacity: 0, display: 'none' }}
            />

            {/* Drawer */}
            <motion.div
              className={styles.drawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25
              }}
            >

              <div className={styles.arrowRight}>
                  <LinkButton
                    title=""
                    iconName="arrowRight"
                    handleClick={() => setOpen(false)}
                  />
              </div>

              <ul className={styles.links}>
                <li>
                   {
                    profile ? (
                      <>
                        <img src={`${profile.avatarImg}`} style={{ width: '5rem', height: 'auto'}} />
                      </>
                    ) : (
                      <>
                       <PillButton
                        title="Sign In"
                        iconName="arrowRight"
                        handleClick={handleSignIn} //go to sign in form component
                       />
                      </>
                    )
                   }
                </li>

                <li>
                    <label className={styles.themeToggle}>
                      <input
                        type="checkbox"
                        checked={theme === "dark"}
                        onChange={toggleTheme}
                      />

                      <span className={styles.slider}>
                        <img
                          src={theme === "dark" ? darkIcon : lightIcon}
                          className={styles.icon}
                          alt="theme icon"
                        />
                      </span>
                    </label>
                </li>

                <li>
                  {
                    user && 
                    <LinkButton
                      title="Sign Out"
                      iconName="powerOff"
                      handleClick={handleSignOut}
                    />
                  }
                </li>

              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}