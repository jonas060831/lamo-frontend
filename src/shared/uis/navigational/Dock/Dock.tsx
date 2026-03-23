import { type FC, type ReactNode } from "react";
import styles from "./Dock.module.css";
import { useLocation } from "react-router";
import { getDeviceInfo } from "../../../../utils/regex/deviceCheck";


interface DockItem {
  label?: string;
  component: ReactNode;
}

interface DockProps {
  items: DockItem[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
}

export const Dock: FC<DockProps> = ({
  items,
  highlightedIndex,
  setHighlightedIndex,
}) => {

  const { isMobileOrTablet } = getDeviceInfo()
  const maxScale = 1.8;
  const step = 0.3;

  const getScale = (index: number) => {
    const distance = Math.abs(index - highlightedIndex);
    return Math.max(1, maxScale - distance * step);
  };

  const getBlur = (index: number) => {
    if (index === highlightedIndex) return "blur(0px)";
    return isMobileOrTablet ? "" : "blur(2px)";
  };

  const getOpacity = (index: number) => {
    if (index === highlightedIndex) return 1;
    return 0.5;
  };

  const { pathname } = useLocation()

  return (
    <div className={styles.dock}>
      {items.map((item, index) => (
        <div
          key={index}
          className={styles.dockItem}
          style={{
            transform: `scale(${getScale(index)})`,
            filter: getBlur(index),
            opacity: getOpacity(index),
            transition: "transform 0.2s ease-out, filter 0.2s ease-out, opacity 0.2s ease-out",
          }}
          onMouseEnter={() => setHighlightedIndex(index)}
          onMouseLeave={() => pathname == '/voice' ?  setHighlightedIndex(1) : highlightedIndex }  //fix for navigation for now 
        >
          {item.component}

          {highlightedIndex === index && item.label && (
            <span className={styles.label}>{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};