import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

import Menu from '../../assets/svgs/menu.svg'
import arrowRight from '../../assets/svgs/arrowRight.svg'
import lightIcon from '../../assets/svgs/sun.svg'
import darkIcon from '../../assets/svgs/moon.svg'

import { Link } from "react-router";
import useTheme from "../../hooks/useTheme";
export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { theme, toggleTheme } = useTheme()


  const handleDismiss = () => setOpen(false)

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
                <li onClick={handleDismiss}><Link to="/">Home</Link></li>
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