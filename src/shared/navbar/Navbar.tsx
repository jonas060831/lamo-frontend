import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

import Menu from '../../assets/svgs/menu.svg'
import arrowRight from '../../assets/svgs/arrowRight.svg'
import lightIcon from '../../assets/svgs/sun.svg'
import darkIcon from '../../assets/svgs/moon.svg'

import useTheme from "../../hooks/useTheme";
import { useAuth, type IUser } from "../../contexts/UserContext";

import * as authService from '../../services/authService'



interface IProfile extends IUser {
  avatarImg: string
  firstName?: string
  lastName?: string
}
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState< IProfile | null>(null)

  const { theme, toggleTheme } = useTheme()

  const { user } = useAuth()


  //const handleDismiss = () => setOpen(false)

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
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              <button
                className={styles.arrowRight}
                onClick={() => setOpen(false)}
              >
                <img 
                 className={`svg ${styles.arrowRightImg}`}
                 src={arrowRight}
                />
              </button>

              <ul className={styles.links}>
                <li>
                   {
                    profile ? (
                      <>
                        <img src={`${profile.avatarImg}`} style={{ width: '5rem', height: 'auto'}} />
                      </>
                    ) : (
                      <>Login ?</>
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

              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}