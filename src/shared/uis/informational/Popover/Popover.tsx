import { useState, useRef, useEffect, type ReactNode } from "react";
import styles from "./Popover.module.css";

type Direction =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left"
  | "right";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  direction?: Direction;
}

export default function Popover({
  trigger,
  children,
  direction = "bottom-right",
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [adjustedDirection, setAdjustedDirection] = useState<Direction>(direction);
  const [ready, setReady] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    setReady(false); // reset ready for recalculation
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Measure popover and adjust direction after render
  useEffect(() => {
    if (!open || !popoverRef.current) return;

    const rect = popoverRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let newDir = direction;

    if (rect.right > vw) newDir = newDir.replace("right", "left") as Direction;
    if (rect.left < 0) newDir = newDir.replace("left", "right") as Direction;
    if (rect.bottom > vh) newDir = newDir.replace("bottom", "top") as Direction;
    if (rect.top < 0) newDir = newDir.replace("top", "bottom") as Direction;

    setAdjustedDirection(newDir);
    setReady(true); // show popover
  }, [open, direction]);

  return (
    <div className={styles.wrapper} ref={popoverRef}>
      <div onClick={toggleOpen} className={styles.trigger}>
        {trigger}
      </div>

      {open && (
        <div
          className={`${styles.popover} ${styles[adjustedDirection]} ${
            ready ? styles.visible : styles.hidden
          }`}
        >
          <div className={`${styles.arrow} ${styles[adjustedDirection + "-arrow"]}`} />
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}